/**
 * ESLint rule: no-component-helper-functions
 *
 * Enforces that component files only contain the component function itself.
 * Helper functions should be extracted to src/utils/ in their own files.
 *
 * This prevents component files from becoming dumping grounds for utility code
 * and encourages reuse across components.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { FunctionDeclaration } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow helper function declarations in component files',
    },
    messages: {
      helperFunction:
        "Function '{{functionName}}' should be defined in src/utils/ in its own file. Check if this function already exists in utils before creating a new file.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/components/
    if (!filename.includes(path.join('src', 'components'))) {
      return {};
    }

    const ext = path.extname(filename);
    if (!['.jsx', '.js', '.tsx', '.ts'].includes(ext)) {
      return {};
    }

    const componentName = path.basename(filename, ext);

    return {
      FunctionDeclaration(node: FunctionDeclaration): void {
        const functionName = node.id.name;

        // Allow the component function itself
        if (functionName === componentName) {
          return;
        }

        context.report({
          node,
          messageId: 'helperFunction',
          data: {
            functionName,
          },
        });
      },
    };
  },
};

export default rule;
