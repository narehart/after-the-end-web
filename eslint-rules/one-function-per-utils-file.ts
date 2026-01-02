/**
 * ESLint rule: one-function-per-utils-file
 *
 * Enforces that utility files in src/utils/ contain only one exported function.
 * This encourages single-responsibility utilities and improves tree-shaking.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { FunctionDeclaration } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce one function per file in src/utils/',
    },
    messages: {
      tooManyFunctions:
        'Utility file contains {{count}} functions ({{functionNames}}). Each utility file should contain only one function. Split into separate files.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/utils/
    if (!filename.includes(path.join('src', 'utils'))) {
      return {};
    }

    const ext = path.extname(filename);
    if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      return {};
    }

    const functionNames: string[] = [];

    return {
      FunctionDeclaration(node: FunctionDeclaration): void {
        functionNames.push(node.id.name);
      },
      'Program:exit'(): void {
        if (functionNames.length > 1) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'tooManyFunctions',
            data: {
              count: String(functionNames.length),
              functionNames: functionNames.join(', '),
            },
          });
        }
      },
    };
  },
};

export default rule;
