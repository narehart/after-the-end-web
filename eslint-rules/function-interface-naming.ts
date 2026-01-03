/**
 * ESLint rule: function-interface-naming
 *
 * Enforces that exported functions use consistent interface naming:
 * - Custom object parameter types should end in "Props"
 * - Custom object return types should end in "Return"
 * Skips types imported from node_modules and primitives.
 */

import type { Rule } from 'eslint';

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

function isLocalImport(source: string): boolean {
  return source.startsWith('.') || source.startsWith('/');
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
    // Only check types imported from local files
    const localTypes = new Set<string>();

    function shouldCheckType(typeName: string): boolean {
      // Only check types imported from local project files
      if (!localTypes.has(typeName)) return false;
      if (typeName.endsWith('Props') || typeName.endsWith('Return')) return false;
      return true;
    }

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
      ImportDeclaration(node: Rule.Node): void {
        const importNode = node as unknown as {
          source: { value: string };
          specifiers: Array<{ local: { name: string } }>;
        };
        if (isLocalImport(importNode.source.value)) {
          for (const spec of importNode.specifiers) {
            localTypes.add(spec.local.name);
          }
        }
      },
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
