import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow function definitions in src/types/ and src/@types/ files',
    },
    messages: {
      noFunctionInTypes:
        'Function "{{name}}" is not allowed in types files. Move it to src/utils/ instead.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/types/ or src/@types/
    const isTypesDir = filename.includes(path.join('src', 'types'));
    const isAtTypesDir = filename.includes(path.join('src', '@types'));

    if (!isTypesDir && !isAtTypesDir) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        context.report({
          node,
          messageId: 'noFunctionInTypes',
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
            messageId: 'noFunctionInTypes',
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
            messageId: 'noFunctionInTypes',
            data: { name },
          });
        }
      },
    };
  },
};

export default rule;
