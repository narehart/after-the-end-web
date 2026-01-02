/**
 * ESLint rule: one-hook-per-file
 *
 * Enforces that hook files in src/hooks/ contain only one exported function.
 * This encourages single-responsibility hooks and improves code organization.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { FunctionDeclaration } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce one hook per file in src/hooks/',
    },
    messages: {
      tooManyHooks:
        'Hook file contains {{count}} functions ({{functionNames}}). Each hook file should contain only one hook. Split into separate files.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/hooks/
    if (!filename.includes(path.join('src', 'hooks'))) {
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
            messageId: 'tooManyHooks',
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
