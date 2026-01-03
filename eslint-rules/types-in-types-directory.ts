/**
 * ESLint rule: types-in-types-directory
 *
 * Enforces that type aliases and interfaces are defined in src/types/,
 * unless they are directly used as parameter or return types for the
 * exported function in the same file.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

interface TypeInfo {
  name: string;
  node: Rule.Node;
}

interface FunctionInfo {
  returnTypeText: string;
  paramTypeTexts: string[];
}

function extractTypeNames(typeText: string): string[] {
  const matches = typeText.match(/\b[A-Z][a-zA-Z0-9]*\b/g);
  return matches ?? [];
}

function extractFunctionInfo(
  funcNode: Rule.Node,
  sourceCode: { getText: (node: Rule.Node | undefined) => string }
): FunctionInfo {
  const func = funcNode as unknown as {
    returnType?: Rule.Node;
    params: Array<{ typeAnnotation?: Rule.Node }>;
  };

  const returnTypeText = func.returnType !== undefined ? sourceCode.getText(func.returnType) : '';
  const paramTypeTexts = func.params
    .filter((p) => p.typeAnnotation !== undefined)
    .map((p) => sourceCode.getText(p.typeAnnotation));

  return { returnTypeText, paramTypeTexts };
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce types/interfaces to be in src/types/, except those used by the exported function',
    },
    messages: {
      typeNotInTypesDir:
        "Type '{{typeName}}' should be defined in src/types/ directory. Only types used as parameters or return types of the exported function are allowed here.",
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

    const sourceCode = context.sourceCode;
    const typeDeclarations: TypeInfo[] = [];
    const exportedFunctions: FunctionInfo[] = [];

    return {
      TSInterfaceDeclaration(node: Rule.Node): void {
        const id = (node as unknown as { id: { name: string } }).id;
        typeDeclarations.push({ name: id.name, node });
      },

      TSTypeAliasDeclaration(node: Rule.Node): void {
        const id = (node as unknown as { id: { name: string } }).id;
        typeDeclarations.push({ name: id.name, node });
      },

      ExportNamedDeclaration(node: Rule.Node): void {
        const declaration = (node as unknown as { declaration: Rule.Node | null }).declaration;
        if (declaration === null) return;

        const declType = (declaration as unknown as { type: string }).type;
        if (declType === 'FunctionDeclaration') {
          exportedFunctions.push(extractFunctionInfo(declaration, sourceCode));
        }
      },

      ExportDefaultDeclaration(node: Rule.Node): void {
        const declaration = (node as unknown as { declaration: Rule.Node }).declaration;
        const declType = (declaration as unknown as { type: string }).type;
        if (declType === 'FunctionDeclaration') {
          exportedFunctions.push(extractFunctionInfo(declaration, sourceCode));
        }
      },

      'Program:exit'(): void {
        const usedByExportedFunctions = new Set<string>();
        for (const func of exportedFunctions) {
          extractTypeNames(func.returnTypeText).forEach((t) => usedByExportedFunctions.add(t));
          for (const paramText of func.paramTypeTexts) {
            extractTypeNames(paramText).forEach((t) => usedByExportedFunctions.add(t));
          }
        }

        for (const typeInfo of typeDeclarations) {
          if (!usedByExportedFunctions.has(typeInfo.name)) {
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
