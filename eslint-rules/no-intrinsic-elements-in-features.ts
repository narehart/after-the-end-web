/**
 * ESLint rule: no-intrinsic-elements-in-features
 *
 * Enforces that feature components compose from primitives only.
 * Intrinsic HTML elements (div, span, button, etc.) are only allowed in:
 *   - src/components/primitives/
 *   - src/components/candidates/
 *
 * Feature components in src/components/features/ must use primitive components.
 */

import path from 'node:path';
import type { Rule } from 'eslint';
import type { JSXOpeningElement, JSXIdentifier } from 'estree-jsx';

const FIRST_CHAR_INDEX = 0;

/**
 * Checks if an element name is an intrinsic HTML element.
 * Intrinsic elements start with lowercase (div, span, button).
 * Custom components start with uppercase (Box, Panel, Button).
 */
function isIntrinsicElement(name: string): boolean {
  const firstChar = name.charAt(FIRST_CHAR_INDEX);
  return firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase();
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow intrinsic HTML elements in feature components (must use primitives)',
    },
    messages: {
      intrinsicInFeatures:
        "Intrinsic element '<{{element}}>' is not allowed in features/. " +
        'Use a primitive component from primitives/ or create one if needed.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/components/features/
    if (!filename.includes(path.join('components', 'features'))) {
      return {};
    }

    // Skip non-component files
    const ext = path.extname(filename);
    if (ext !== '.tsx' && ext !== '.jsx') {
      return {};
    }

    return {
      JSXOpeningElement(node: JSXOpeningElement): void {
        // Only check JSXIdentifier (not JSXMemberExpression like React.Fragment)
        if (node.name.type !== 'JSXIdentifier') {
          return;
        }

        const elementName = node.name.name;

        // Skip custom components (PascalCase)
        if (!isIntrinsicElement(elementName)) {
          return;
        }

        context.report({
          node,
          messageId: 'intrinsicInFeatures',
          data: { element: elementName },
        });
      },
    };
  },
};

export default rule;
