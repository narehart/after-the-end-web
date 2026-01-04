/**
 * ESLint rule: function-interface-naming
 *
 * Enforces that exported functions use consistent interface naming:
 * - Custom object parameter types should end in "Props"
 * - Custom object return types should end in "Return"
 * Skips types imported from node_modules.
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

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object';
}

function hasProperty<K extends string>(
  obj: Record<string, unknown>,
  key: K
): obj is Record<K, unknown> {
  return key in obj;
}

function getString(obj: Record<string, unknown>, key: string): string | null {
  if (!hasProperty(obj, key)) return null;
  const value = obj[key];
  return typeof value === 'string' ? value : null;
}

function getObject(obj: Record<string, unknown>, key: string): Record<string, unknown> | null {
  if (!hasProperty(obj, key)) return null;
  const value = obj[key];
  return isNonNullObject(value) ? value : null;
}

function extractTypeNameFromAnnotation(wrapper: Record<string, unknown>): string | null {
  const inner = getObject(wrapper, 'typeAnnotation');
  if (inner === null) return null;
  if (getString(inner, 'type') !== 'TSTypeReference') return null;
  const typeName = getObject(inner, 'typeName');
  if (typeName === null) return null;
  return getString(typeName, 'name');
}

function getTypeName(typeAnnotation: unknown): string | null {
  if (!isNonNullObject(typeAnnotation)) return null;
  return extractTypeNameFromAnnotation(typeAnnotation);
}

function getReturnTypeName(returnType: unknown): string | null {
  if (!isNonNullObject(returnType)) return null;
  const typeAnnotation = getObject(returnType, 'typeAnnotation');
  if (typeAnnotation === null) return null;
  const type = getString(typeAnnotation, 'type');
  if (type === null || PRIMITIVE_TYPES.has(type)) return null;
  if (type !== 'TSTypeReference') return null;
  const typeName = getObject(typeAnnotation, 'typeName');
  if (typeName === null) return null;
  return getString(typeName, 'name');
}

function isLocalImport(source: string): boolean {
  return source.startsWith('.') || source.startsWith('/');
}

function extractLocalName(spec: unknown): string | null {
  if (!isNonNullObject(spec)) return null;
  const local = getObject(spec, 'local');
  if (local === null) return null;
  return getString(local, 'name');
}

function extractFunctionInfo(
  node: Rule.Node
): { decl: Record<string, unknown>; name: string } | null {
  if (!isNonNullObject(node)) return null;
  const decl = getObject(node, 'declaration');
  if (decl === null) return null;
  if (getString(decl, 'type') !== 'FunctionDeclaration') return null;
  const id = getObject(decl, 'id');
  if (id === null) return null;
  const name = getString(id, 'name');
  if (name === null) return null;
  return { decl, name };
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
    const localTypes = new Set<string>();

    function shouldCheckType(typeName: string): boolean {
      if (!localTypes.has(typeName)) return false;
      return !typeName.endsWith('Props') && !typeName.endsWith('Return');
    }

    function getParamTypeName(param: unknown): string | null {
      if (!isNonNullObject(param)) return null;
      if (!hasProperty(param, 'typeAnnotation')) return null;
      return getTypeName(param['typeAnnotation']);
    }

    function checkParams(node: Rule.Node, params: unknown[], funcName: string): void {
      for (const param of params) {
        const typeName = getParamTypeName(param);
        if (typeName !== null && shouldCheckType(typeName)) {
          context.report({ node, messageId: 'paramNotProps', data: { funcName, typeName } });
        }
      }
    }

    function checkFunctionNode(
      node: Rule.Node,
      decl: Record<string, unknown>,
      funcName: string
    ): void {
      if (hasProperty(decl, 'params') && Array.isArray(decl['params'])) {
        checkParams(node, decl['params'], funcName);
      }

      if (hasProperty(decl, 'returnType')) {
        const returnTypeName = getReturnTypeName(decl['returnType']);
        if (returnTypeName !== null && shouldCheckType(returnTypeName)) {
          context.report({
            node,
            messageId: 'returnNotReturn',
            data: { funcName, typeName: returnTypeName },
          });
        }
      }
    }

    function processImportSpecifiers(node: Rule.Node): void {
      if (!isNonNullObject(node) || !hasProperty(node, 'specifiers')) return;
      const specifiers = node.specifiers;
      if (!Array.isArray(specifiers)) return;
      for (const spec of specifiers) {
        const name = extractLocalName(spec);
        if (name !== null) {
          localTypes.add(name);
        }
      }
    }

    return {
      ImportDeclaration(node: Rule.Node): void {
        if (!isNonNullObject(node)) return;
        const source = getObject(node, 'source');
        if (source === null) return;
        const sourceValue = getString(source, 'value');
        if (sourceValue === null || !isLocalImport(sourceValue)) return;
        processImportSpecifiers(node);
      },

      ExportNamedDeclaration(node: Rule.Node): void {
        const info = extractFunctionInfo(node);
        if (info !== null) {
          checkFunctionNode(node, info.decl, info.name);
        }
      },

      ExportDefaultDeclaration(node: Rule.Node): void {
        const info = extractFunctionInfo(node);
        if (info !== null) {
          checkFunctionNode(node, info.decl, info.name);
        }
      },
    };
  },
};

export default rule;
