/**
 * ESLint rule: one-system-per-file
 *
 * Enforces that src/ecs/systems/ files export exactly one system function.
 * Type exports (export type { ... }) are allowed alongside the function.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const ZERO_EXPORTS = 0;
const ONE_EXPORT = 1;

function isTypeOnlyExport(node: Rule.Node): boolean {
  if (node.type !== 'ExportNamedDeclaration') return false;
  if (!('exportKind' in node)) return false;
  return node.exportKind === 'type';
}

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

    let functionExportCount = 0;

    return {
      ExportNamedDeclaration(node): void {
        // Skip type-only exports (export type { ... })
        if (!isTypeOnlyExport(node)) {
          functionExportCount++;
        }
      },
      ExportDefaultDeclaration(): void {
        functionExportCount++;
      },
      'Program:exit'(node): void {
        if (functionExportCount === ZERO_EXPORTS) {
          context.report({
            node,
            messageId: 'noExports',
          });
        } else if (functionExportCount > ONE_EXPORT) {
          context.report({
            node,
            messageId: 'tooManyExports',
            data: { count: String(functionExportCount) },
          });
        }
      },
    };
  },
};

export default rule;
