/**
 * ESLint rule: no-cross-component-css-imports
 *
 * Enforces that components can only import their own CSS modules.
 * A component FooBar.jsx can only import FooBar.module.css, not OtherComponent.module.css.
 *
 * This prevents tight coupling between components via shared CSS.
 */

import path from 'path';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing CSS modules from other components',
      category: 'Best Practices',
    },
    messages: {
      crossComponentImport:
        "Component '{{componentName}}' cannot import CSS from '{{cssFile}}'. Each component should have its own CSS module '{{expectedCss}}'.",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename();
    const ext = path.extname(filename);

    // Only check .jsx and .js files
    if (ext !== '.jsx' && ext !== '.js') {
      return {};
    }

    const componentName = path.basename(filename, ext);

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Only check CSS module imports
        if (!importPath.endsWith('.module.css')) {
          return;
        }

        // Extract the CSS module name (e.g., "DetailsPanel" from "./DetailsPanel.module.css")
        const cssFileName = path.basename(importPath, '.module.css');

        // Allow if the CSS module name matches the component name
        if (cssFileName === componentName) {
          return;
        }

        // Allow index files to import any CSS (they're typically barrel exports)
        if (componentName === 'index') {
          return;
        }

        context.report({
          node,
          messageId: 'crossComponentImport',
          data: {
            componentName,
            cssFile: cssFileName + '.module.css',
            expectedCss: componentName + '.module.css',
          },
        });
      },
    };
  },
};
