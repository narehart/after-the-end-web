/**
 * ESLint rule: no-reexports-in-types
 *
 * Prevents re-exporting from other modules in src/types/ files.
 * Each types file should only contain its own type definitions.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow re-exporting from other modules in src/types/ files',
    },
    messages: {
      noReexport:
        'Re-exporting from other modules is not allowed in types files. Define types directly or import them where needed.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only apply to files in src/types/
    if (!filename.includes(path.join('src', 'types'))) {
      return {};
    }

    const ext = path.extname(filename);
    if (!['.ts', '.tsx'].includes(ext)) {
      return {};
    }

    return {
      // Catches: export { Foo } from './other'
      // Catches: export type { Foo } from './other'
      ExportNamedDeclaration(node): void {
        if (node.source !== null) {
          context.report({
            node,
            messageId: 'noReexport',
          });
        }
      },

      // Catches: export * from './other'
      ExportAllDeclaration(node): void {
        context.report({
          node,
          messageId: 'noReexport',
        });
      },
    };
  },
};

export default rule;
