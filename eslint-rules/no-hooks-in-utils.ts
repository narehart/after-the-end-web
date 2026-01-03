/**
 * ESLint rule: no-hooks-in-utils
 *
 * Prevents React hooks (functions starting with "use") from being defined
 * in src/utils/. Hooks should be placed in src/hooks/ instead.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

function isHookName(name: string): boolean {
  return /^use[A-Z]/.test(name);
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow React hooks in src/utils/ files',
    },
    messages: {
      noHookInUtils:
        'Hook "{{name}}" is not allowed in utils files. Move it to src/hooks/ instead.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/utils/
    if (!filename.includes(path.join('src', 'utils'))) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        if (isHookName(node.id.name)) {
          context.report({
            node,
            messageId: 'noHookInUtils',
            data: { name: node.id.name },
          });
        }
      },
      ArrowFunctionExpression(node): void {
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.id.type === 'Identifier' &&
          isHookName(node.parent.id.name)
        ) {
          context.report({
            node,
            messageId: 'noHookInUtils',
            data: { name: node.parent.id.name },
          });
        }
      },
      FunctionExpression(node): void {
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.id.type === 'Identifier' &&
          isHookName(node.parent.id.name)
        ) {
          context.report({
            node,
            messageId: 'noHookInUtils',
            data: { name: node.parent.id.name },
          });
        }
      },
    };
  },
};

export default rule;
