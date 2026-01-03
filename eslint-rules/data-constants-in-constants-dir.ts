import path from 'node:path';
import type { Rule } from 'eslint';
import type { Node, VariableDeclarator, Expression, Pattern } from 'estree';

interface VariableDeclaratorWithParent extends VariableDeclarator {
  parent: Node & { kind?: string };
}

interface TSTypeAssertionExpression {
  type: 'TSAsExpression' | 'TSSatisfiesExpression';
  expression: Expression;
}

type ExpressionOrTSAssertion = Expression | TSTypeAssertionExpression;

const DATA_LITERAL_TYPES = new Set([
  'ObjectExpression',
  'ArrayExpression',
  'Literal',
  'TemplateLiteral',
]);

function isTSTypeAssertion(node: ExpressionOrTSAssertion): node is TSTypeAssertionExpression {
  return node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression';
}

/**
 * Check if an expression is a data literal (object, array, or primitive)
 * as opposed to a function or call expression.
 */
function isDataLiteral(init: ExpressionOrTSAssertion | null | undefined): boolean {
  if (init === null || init === undefined) return false;

  // Handle TS type assertions by checking inner expression
  if (isTSTypeAssertion(init)) {
    return isDataLiteral(init.expression);
  }

  return DATA_LITERAL_TYPES.has(init.type);
}

/**
 * Check if a name looks like a store slice creator (e.g., createXxxSlice)
 */
function isSliceCreator(name: string): boolean {
  return /^create[A-Z].*Slice$/.test(name);
}

/**
 * Get the name from a pattern (handles Identifier and destructuring)
 */
function getPatternName(pattern: Pattern): string | null {
  if (pattern.type === 'Identifier') {
    return pattern.name;
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require module-level data constants to be defined in src/constants/',
    },
    messages: {
      moveToConstants:
        'Data constant "{{name}}" should be moved to src/constants/ and use SCREAMING_SNAKE_CASE.',
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Allow constants in src/constants/
    if (filename.includes(path.join('src', 'constants'))) {
      return {};
    }

    // Allow in config files
    if (filename.includes(path.join('src', 'config'))) {
      return {};
    }

    // Only check files in src/
    if (!filename.includes(path.join('src', ''))) {
      return {};
    }

    return {
      VariableDeclarator(node: VariableDeclaratorWithParent): void {
        // Check if this is a const declaration
        const parent = node.parent;
        if (parent.kind !== 'const') {
          return;
        }

        // Only check top-level declarations
        const ancestors = context.sourceCode.getAncestors(node);
        const isTopLevel = ancestors.every(
          (ancestor) =>
            ancestor.type === 'Program' ||
            ancestor.type === 'ExportNamedDeclaration' ||
            ancestor.type === 'VariableDeclaration'
        );
        if (!isTopLevel) {
          return;
        }

        // Get the variable name
        const name = getPatternName(node.id);
        if (name === null) {
          return;
        }

        // Skip slice creators (they're functions even if typed weirdly)
        if (isSliceCreator(name)) {
          return;
        }

        // Check if the initializer is a data literal
        if (node.init !== null && isDataLiteral(node.init)) {
          context.report({
            node,
            messageId: 'moveToConstants',
            data: { name },
          });
        }
      },
    };
  },
};

export default rule;
