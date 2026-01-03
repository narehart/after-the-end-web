/**
 * ESLint rule: types-in-types-directory
 *
 * Enforces that type aliases and interfaces are defined in src/types/,
 * unless they are function interfaces (names ending in Props or Return).
 */

import path from 'node:path';
import type { Rule } from 'eslint';

interface TypeInfo {
  name: string;
  node: Rule.Node;
}

function isFunctionInterface(name: string): boolean {
  return name.endsWith('Props') || name.endsWith('Return');
}

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object';
}

function getIdName(node: Rule.Node): string | null {
  if (!isNonNullObject(node)) return null;
  if (!('id' in node)) return null;
  const id = node['id'];
  if (!isNonNullObject(id)) return null;
  if (!('name' in id)) return null;
  const name = id['name'];
  return typeof name === 'string' ? name : null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce types/interfaces to be in src/types/, except function interfaces (Props/Return)',
    },
    messages: {
      typeNotInTypesDir:
        "Type '{{typeName}}' should be defined in src/types/ directory. Only function interfaces (ending in Props or Return) are allowed locally.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Skip files in src/types/
    if (filename.includes(path.join('src', 'types'))) {
      return {};
    }

    // Skip files not in src/
    if (!filename.includes(path.join('src', ''))) {
      return {};
    }

    const ext = path.extname(filename);
    if (!['.ts', '.tsx'].includes(ext)) {
      return {};
    }

    const typeDeclarations: TypeInfo[] = [];

    return {
      TSInterfaceDeclaration(node: Rule.Node): void {
        const name = getIdName(node);
        if (name !== null) {
          typeDeclarations.push({ name, node });
        }
      },

      TSTypeAliasDeclaration(node: Rule.Node): void {
        const name = getIdName(node);
        if (name !== null) {
          typeDeclarations.push({ name, node });
        }
      },

      'Program:exit'(): void {
        for (const typeInfo of typeDeclarations) {
          if (!isFunctionInterface(typeInfo.name)) {
            context.report({
              node: typeInfo.node,
              messageId: 'typeNotInTypesDir',
              data: { typeName: typeInfo.name },
            });
          }
        }
      },
    };
  },
};

export default rule;
