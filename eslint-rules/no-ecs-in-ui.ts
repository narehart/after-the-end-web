/**
 * ESLint rule: no-ecs-in-ui
 *
 * Forbids direct ECS imports in src/ui/** files.
 * UI should access ECS through bridge layer (renderer/rendererBridge or hooks).
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct ECS imports in UI components',
    },
    messages: {
      noEcsInUi:
        "Direct ECS import '{{source}}' is not allowed in UI files. Use hooks or renderer bridge instead.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ui/
    if (!filename.includes(path.join('src', 'ui'))) {
      return {};
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const importPath = node.source.value;

        if (typeof importPath !== 'string') {
          return;
        }

        // Check for ECS imports (relative paths containing /ecs/ or absolute @/ecs/)
        if (importPath.includes('/ecs/') || importPath.startsWith('@/ecs/')) {
          context.report({
            node,
            messageId: 'noEcsInUi',
            data: { source: importPath },
          });
        }
      },
    };
  },
};

export default rule;
