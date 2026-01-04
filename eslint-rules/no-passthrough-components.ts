/**
 * ESLint rule: no-passthrough-components
 *
 * Detects components that simply pass all their props through to another component
 * without adding any logic, styling, or additional functionality.
 *
 * These wrapper components add indirection without value and should be removed.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { FunctionDeclaration, ArrowFunctionExpression, ReturnStatement } from 'estree-jsx';

const EMPTY = 0;

interface PassthroughResult {
  isPassthrough: boolean;
  childComponent?: string;
}

function isComponentName(name: string): boolean {
  return /^[A-Z]/.test(name);
}

function getDestructuredParamNames(
  params: (FunctionDeclaration | ArrowFunctionExpression)['params']
): Set<string> {
  const names = new Set<string>();

  for (const param of params) {
    if (param.type === 'ObjectPattern') {
      for (const prop of param.properties) {
        if (prop.type === 'Property' && prop.key.type === 'Identifier') {
          names.add(prop.key.name);
        }
      }
    }
  }

  return names;
}

function checkJsxAttribute(
  attr: Rule.Node,
  paramNames: Set<string>,
  usedParams: Set<string>
): boolean {
  if (attr.type === 'JSXSpreadAttribute') {
    if (attr.argument.type === 'Identifier') {
      usedParams.add(attr.argument.name);
    }
    return true;
  }

  if (attr.type !== 'JSXAttribute') {
    return false;
  }

  const value = attr.value;
  if (value?.type === 'JSXExpressionContainer') {
    const expr = value.expression;
    if (expr.type === 'Identifier') {
      if (paramNames.has(expr.name)) {
        usedParams.add(expr.name);
        return true;
      }
    }
  }

  return false;
}

function allParamsUsed(paramNames: Set<string>, usedParams: Set<string>): boolean {
  if (usedParams.size !== paramNames.size) {
    return false;
  }

  for (const param of paramNames) {
    if (!usedParams.has(param)) {
      return false;
    }
  }

  return true;
}

function isPassthroughReturn(
  returnNode: ReturnStatement,
  paramNames: Set<string>
): PassthroughResult {
  const arg = returnNode.argument;

  if (arg?.type !== 'JSXElement') {
    return { isPassthrough: false };
  }

  const opening = arg.openingElement;
  if (opening.name.type !== 'JSXIdentifier') {
    return { isPassthrough: false };
  }

  const elementName = opening.name.name;
  if (!isComponentName(elementName)) {
    return { isPassthrough: false };
  }

  if (arg.children.length > EMPTY) {
    return { isPassthrough: false };
  }

  const usedParams = new Set<string>();
  for (const attr of opening.attributes) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- ESLint Rule.Node type is needed
    if (!checkJsxAttribute(attr as Rule.Node, paramNames, usedParams)) {
      return { isPassthrough: false };
    }
  }

  if (!allParamsUsed(paramNames, usedParams)) {
    return { isPassthrough: false };
  }

  return { isPassthrough: true, childComponent: elementName };
}

function checkFunctionDeclaration(node: FunctionDeclaration, context: Rule.RuleContext): void {
  const funcId = node.id;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- estree spec allows null id
  if (funcId === null) {
    return;
  }

  if (!isComponentName(funcId.name)) {
    return;
  }

  const paramNames = getDestructuredParamNames(node.params);
  if (paramNames.size === EMPTY) {
    return;
  }

  for (const stmt of node.body.body) {
    if (stmt.type === 'ReturnStatement') {
      const result = isPassthroughReturn(stmt, paramNames);
      if (result.isPassthrough) {
        context.report({
          node,
          messageId: 'passthroughComponent',
          data: {
            componentName: funcId.name,
            childComponent: result.childComponent,
          },
        });
      }
    }
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow components that just pass props through to another component',
    },
    messages: {
      passthroughComponent:
        "Component '{{componentName}}' is a passthrough wrapper around '{{childComponent}}'. Use '{{childComponent}}' directly instead.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    if (!filename.includes(path.join('src', 'components'))) {
      return {};
    }

    if (filename.includes(path.join('components', 'primitives'))) {
      return {};
    }

    const ext = path.extname(filename);
    if (!['.jsx', '.tsx'].includes(ext)) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        checkFunctionDeclaration(node, context);
      },
    };
  },
};

export default rule;
