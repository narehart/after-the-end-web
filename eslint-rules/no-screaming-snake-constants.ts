import path from 'node:path';
import type { Rule } from 'eslint';
import type { Node, VariableDeclarator } from 'estree';

const SCREAMING_SNAKE_CASE = /^[A-Z][A-Z0-9_]*$/;

interface VariableDeclaratorWithParent extends VariableDeclarator {
  parent: Node;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow SCREAMING_SNAKE_CASE constants outside of src/constants/',
    },
    messages: {
      noScreamingSnakeConstant:
        'SCREAMING_SNAKE_CASE constant "{{name}}" must be defined in src/constants/, not here.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Allow constants in src/constants/
    if (filename.includes(path.join('src', 'constants'))) {
      return {};
    }

    // Only check files in src/
    if (!filename.includes(path.join('src', ''))) {
      return {};
    }

    return {
      VariableDeclarator(node: VariableDeclaratorWithParent): void {
        // Check if this is a const declaration
        const parent = node.parent;
        if (!('kind' in parent) || parent.kind !== 'const') {
          return;
        }

        // Check if the variable name is SCREAMING_SNAKE_CASE
        if (node.id.type === 'Identifier') {
          const name = node.id.name;
          if (SCREAMING_SNAKE_CASE.test(name)) {
            context.report({
              node,
              messageId: 'noScreamingSnakeConstant',
              data: { name },
            });
          }
        }
      },
    };
  },
};

export default rule;
