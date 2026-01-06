/**
 * ESLint rule: ecs-components-data-only
 *
 * Enforces that ECS component files in src/ecs/components/ contain only
 * interface/type definitions (data shapes), not functions or methods.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that ECS components are data-only (no functions)',
    },
    messages: {
      noFunctionsInComponents:
        'ECS component files should only contain interface/type definitions, not functions.',
      noMethodsInComponents:
        'ECS component interfaces should not have methods. Use systems for logic.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/components/
    if (!filename.includes(path.join('src', 'ecs', 'components'))) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        context.report({
          node,
          messageId: 'noFunctionsInComponents',
        });
      },
      ArrowFunctionExpression(node): void {
        // Only disallow arrow functions assigned to variables
        // Arrow functions in type definitions (callback types) have different parents
        if (node.parent.type === 'VariableDeclarator') {
          context.report({
            node,
            messageId: 'noFunctionsInComponents',
          });
        }
      },
      // TSMethodSignature is a TypeScript-specific AST node type not in ESLint's Rule types
      ['TSMethodSignature' satisfies string](node: Rule.Node): void {
        context.report({
          node,
          messageId: 'noMethodsInComponents',
        });
      },
    };
  },
};

export default rule;
