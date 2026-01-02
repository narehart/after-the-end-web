import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow function definitions in src/constants/ files',
    },
    messages: {
      noFunctionInConstants:
        'Function "{{name}}" is not allowed in constants files. Constants files should only contain constant values.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/constants/
    if (!filename.includes(path.join('src', 'constants'))) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        context.report({
          node,
          messageId: 'noFunctionInConstants',
          data: { name: node.id.name },
        });
      },
      ArrowFunctionExpression(node): void {
        // Only report top-level arrow functions assigned to variables
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.parent.type === 'VariableDeclaration' &&
          node.parent.parent.parent.type === 'Program'
        ) {
          const name = node.parent.id.type === 'Identifier' ? node.parent.id.name : 'anonymous';
          context.report({
            node,
            messageId: 'noFunctionInConstants',
            data: { name },
          });
        }
      },
      FunctionExpression(node): void {
        // Only report top-level function expressions assigned to variables
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.parent.type === 'VariableDeclaration' &&
          node.parent.parent.parent.type === 'Program'
        ) {
          const name = node.parent.id.type === 'Identifier' ? node.parent.id.name : 'anonymous';
          context.report({
            node,
            messageId: 'noFunctionInConstants',
            data: { name },
          });
        }
      },
    };
  },
};

export default rule;
