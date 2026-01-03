/**
 * ESLint rule: function-interface-naming
 *
 * Enforces that exported functions use consistent interface naming:
 * - Custom object parameter types should end in "Props"
 * - Custom object return types should end in "Return"
 * Skips built-in types, primitives, and common domain types.
 */

import type { Rule } from 'eslint';

const BUILTIN_TYPES = new Set([
  'RefObject',
  'MutableRefObject',
  'Ref',
  'ForwardedRef',
  'Set',
  'Map',
  'WeakSet',
  'WeakMap',
  'Array',
  'Promise',
  'Record',
  'Partial',
  'Required',
  'Readonly',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'ReturnType',
  'Parameters',
  'HTMLElement',
  'HTMLDivElement',
  'HTMLButtonElement',
  'Element',
  'Gamepad',
  'KeyboardEvent',
  'MouseEvent',
  'Event',
  'CSSProperties',
  'ReactNode',
  'JSX',
]);

const PRIMITIVE_TYPES = new Set([
  'TSNumberKeyword',
  'TSStringKeyword',
  'TSBooleanKeyword',
  'TSVoidKeyword',
  'TSNullKeyword',
  'TSUndefinedKeyword',
  'TSNeverKeyword',
  'TSAnyKeyword',
  'TSUnknownKeyword',
  'TSArrayType',
]);

// Domain type suffixes that don't need Props/Return naming
const DOMAIN_SUFFIXES = [
  'State',
  'Actions',
  'Slice',
  'Store',
  'Map',
  'Grid',
  'Cell',
  'Item',
  'Size',
  'Stats',
  'Type',
  'Context',
  'Level',
  'Segment',
  'Rect',
  'Direction',
  'Handler',
  'Position',
  'Resolution',
  'Refs',
  'Callbacks',
  'Dimensions',
  'Link',
  'Source',
];

function getTypeName(typeAnnotation: unknown): string | null {
  const ta = typeAnnotation as
    | { typeAnnotation?: { type?: string; typeName?: { name?: string } } }
    | undefined;
  if (ta === undefined) return null;
  if (ta.typeAnnotation?.type === 'TSTypeReference') {
    return ta.typeAnnotation.typeName?.name ?? null;
  }
  return null;
}

function getReturnTypeName(returnType: unknown): string | null {
  const rt = returnType as
    | { typeAnnotation?: { type: string; typeName?: { name?: string } } }
    | undefined;
  if (rt === undefined) return null;
  const typeAnnotation = rt.typeAnnotation;
  if (typeAnnotation === undefined) return null;
  if (PRIMITIVE_TYPES.has(typeAnnotation.type)) return null;
  if (typeAnnotation.type === 'TSTypeReference') {
    return typeAnnotation.typeName?.name ?? null;
  }
  return null;
}

function hasDomainSuffix(typeName: string): boolean {
  return DOMAIN_SUFFIXES.some((suffix) => typeName.endsWith(suffix));
}

function shouldCheckType(typeName: string): boolean {
  if (BUILTIN_TYPES.has(typeName)) return false;
  if (typeName.endsWith('Props') || typeName.endsWith('Return')) return false;
  if (hasDomainSuffix(typeName)) return false;
  return true;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce function interface naming conventions (Props/Return)',
    },
    messages: {
      paramNotProps: "Function '{{funcName}}' parameter type '{{typeName}}' should end in 'Props'.",
      returnNotReturn: "Function '{{funcName}}' return type '{{typeName}}' should end in 'Return'.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    function checkFunction(node: Rule.Node, funcName: string): void {
      const func = node as unknown as { params: unknown[]; returnType?: unknown };

      for (const param of func.params) {
        const typeName = getTypeName((param as { typeAnnotation?: unknown }).typeAnnotation);
        if (typeName !== null && shouldCheckType(typeName)) {
          context.report({ node, messageId: 'paramNotProps', data: { funcName, typeName } });
        }
      }

      const returnTypeName = getReturnTypeName(func.returnType);
      if (returnTypeName !== null && shouldCheckType(returnTypeName)) {
        context.report({
          node,
          messageId: 'returnNotReturn',
          data: { funcName, typeName: returnTypeName },
        });
      }
    }

    return {
      ExportNamedDeclaration(node: Rule.Node): void {
        const decl = (node as unknown as { declaration?: { type: string; id?: { name: string } } })
          .declaration;
        if (decl?.type === 'FunctionDeclaration' && decl.id?.name !== undefined) {
          checkFunction(decl as unknown as Rule.Node, decl.id.name);
        }
      },
      ExportDefaultDeclaration(node: Rule.Node): void {
        const decl = (node as unknown as { declaration: { type: string; id?: { name: string } } })
          .declaration;
        if (decl.type === 'FunctionDeclaration' && decl.id?.name !== undefined) {
          checkFunction(decl as unknown as Rule.Node, decl.id.name);
        }
      },
    };
  },
};

export default rule;
