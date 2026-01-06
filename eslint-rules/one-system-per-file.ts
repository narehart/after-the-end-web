/**
 * ESLint rule: one-system-per-file
 *
 * Enforces that src/ecs/systems/ files export exactly one system function.
 * Similar to one-function-per-utils-file but for ECS systems.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const ZERO_EXPORTS = 0;
const ONE_EXPORT = 1;

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce one system function per file in src/ecs/systems/',
    },
    messages: {
      tooManyExports:
        'ECS system files should export exactly one system function. Found {{count}} exports.',
      noExports: 'ECS system files must export exactly one system function.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/systems/
    if (!filename.includes(path.join('src', 'ecs', 'systems'))) {
      return {};
    }

    let exportCount = 0;

    return {
      ExportNamedDeclaration(): void {
        exportCount++;
      },
      ExportDefaultDeclaration(): void {
        exportCount++;
      },
      'Program:exit'(node): void {
        if (exportCount === ZERO_EXPORTS) {
          context.report({
            node,
            messageId: 'noExports',
          });
        } else if (exportCount > ONE_EXPORT) {
          context.report({
            node,
            messageId: 'tooManyExports',
            data: { count: String(exportCount) },
          });
        }
      },
    };
  },
};

export default rule;
