/**
 * ESLint rule: no-plain-classname-literals
 *
 * Enforces that components use CSS modules instead of plain className strings.
 * Flags: className="foo" or className="foo bar"
 * Allows: className={cx('foo')} or className={styles.foo}
 *
 * This ensures all styling goes through CSS modules for proper scoping.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow plain string literals in className attributes',
      category: 'Best Practices',
    },
    messages: {
      plainClassName:
        'Use CSS modules instead of plain className strings. Replace className="{{value}}" with className={cx(\'{{value}}\')} after importing styles.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Only check className attributes
        if (node.name.name !== 'className') {
          return;
        }

        // Check if the value is a plain string literal
        if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const value = node.value.value;

          // Skip empty strings
          if (!value.trim()) {
            return;
          }

          context.report({
            node,
            messageId: 'plainClassName',
            data: {
              value,
            },
          });
        }
      },
    };
  },
};
