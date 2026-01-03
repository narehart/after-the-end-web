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
        const id = (node as unknown as { id: { name: string } }).id;
        typeDeclarations.push({ name: id.name, node });
      },

      TSTypeAliasDeclaration(node: Rule.Node): void {
        const id = (node as unknown as { id: { name: string } }).id;
        typeDeclarations.push({ name: id.name, node });
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
