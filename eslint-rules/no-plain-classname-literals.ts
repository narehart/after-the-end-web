/**
 * ESLint rule: no-plain-classname-literals
 *
 * Enforces that components use CSS modules instead of plain className strings.
 * Flags: className="foo" or className="foo bar"
 * Allows: className={cx('foo')} or className={styles.foo}
 *
 * This ensures all styling goes through CSS modules for proper scoping.
 */

import type { Rule } from 'eslint';
import type { JSXAttribute, JSXIdentifier } from 'estree-jsx';

interface JSXAttributeWithLiteral extends JSXAttribute {
  name: JSXIdentifier;
  value: { type: 'Literal'; value: string };
}

function isClassNameWithStringLiteral(node: JSXAttribute): node is JSXAttributeWithLiteral {
  return (
    node.name.type === 'JSXIdentifier' &&
    node.name.name === 'className' &&
    node.value !== null &&
    node.value.type === 'Literal' &&
    typeof node.value.value === 'string'
  );
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow plain string literals in className attributes',
    },
    messages: {
      plainClassName:
        'Use CSS modules instead of plain className strings. Replace className="{{value}}" with className={cx(\'{{value}}\')} after importing styles.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    return {
      JSXAttribute(node: JSXAttribute): void {
        if (!isClassNameWithStringLiteral(node)) {
          return;
        }

        const value = node.value.value;

        // Skip empty strings
        if (value.trim() === '') {
          return;
        }

        context.report({
          node,
          messageId: 'plainClassName',
          data: {
            value,
          },
        });
      },
    };
  },
};

export default rule;
