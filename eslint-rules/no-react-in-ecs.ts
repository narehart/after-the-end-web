/**
 * ESLint rule: no-react-in-ecs
 *
 * Forbids React imports in src/ecs/** files.
 * Keeps the ECS layer framework-agnostic.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'estree';

const reactPackages = new Set(['react', 'react-dom', 'react/jsx-runtime']);

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow React imports in ECS files',
    },
    messages: {
      noReactInEcs:
        "React import '{{source}}' is not allowed in ECS files. Keep ECS layer framework-agnostic.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/
    if (!filename.includes(path.join('src', 'ecs'))) {
      return {};
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const importPath = node.source.value;

        if (typeof importPath !== 'string') {
          return;
        }

        // Check for React package imports
        if (reactPackages.has(importPath) || importPath.startsWith('react/')) {
          context.report({
            node,
            messageId: 'noReactInEcs',
            data: { source: importPath },
          });
        }
      },
    };
  },
};

export default rule;
