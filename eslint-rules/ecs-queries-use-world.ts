/**
 * ESLint rule: ecs-queries-use-world
 *
 * Enforces that exported functions in src/ecs/queries/ reference the ECS world.
 * This ensures query files only contain actual ECS queries, not static data utilities.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

const FIRST_INDEX = 0;
const WORLD_IDENTIFIER = 'world';

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object';
}

function hasProperty<K extends string>(
  obj: Record<string, unknown>,
  key: K
): obj is Record<string, unknown> & Record<K, unknown> {
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

function getArrayItem(arr: unknown[], index: number): Record<string, unknown> | null {
  const item: unknown = arr[index];
  return isNonNullObject(item) ? item : null;
}

function isWorldIdentifier(node: Record<string, unknown>): boolean {
  return getString(node, 'type') === 'Identifier' && getString(node, 'name') === WORLD_IDENTIFIER;
}

function getNodeChildren(node: Record<string, unknown>): Array<Record<string, unknown>> {
  const children: Array<Record<string, unknown>> = [];

  for (const key of Object.keys(node)) {
    if (key === 'parent') continue;

    const value = node[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNonNullObject(item) && hasProperty(item, 'type')) {
          children.push(item);
        }
      }
    } else if (isNonNullObject(value) && hasProperty(value, 'type')) {
      children.push(value);
    }
  }

  return children;
}

function containsWorldReference(node: Record<string, unknown>): boolean {
  if (isWorldIdentifier(node)) {
    return true;
  }

  const children = getNodeChildren(node);
  for (const child of children) {
    if (containsWorldReference(child)) {
      return true;
    }
  }

  return false;
}

function getFunctionName(node: Record<string, unknown>): string | null {
  const id = getObject(node, 'id');
  if (id === null) return null;
  return getString(id, 'name');
}

function getVariableName(node: Record<string, unknown>): string | null {
  if (!hasProperty(node, 'declarations')) return null;
  const declarations = node.declarations;
  if (!Array.isArray(declarations)) return null;
  const decl = getArrayItem(declarations, FIRST_INDEX);
  if (decl === null) return null;
  const id = getObject(decl, 'id');
  if (id === null) return null;
  if (getString(id, 'type') !== 'Identifier') return null;
  return getString(id, 'name');
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return isNonNullObject(value) ? value : null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that exports in ecs/queries/ reference the ECS world',
    },
    messages: {
      exportMustUseWorld:
        "Exported '{{name}}' does not reference ECS world. Query files should only contain ECS queries. Move static data utilities elsewhere.",
      functionMustUseWorld:
        "Function '{{name}}' does not reference ECS world. Query files should only contain ECS queries. Move static data utilities elsewhere.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/queries/
    if (!filename.includes(path.join('src', 'ecs', 'queries'))) {
      return {};
    }

    return {
      FunctionDeclaration(node): void {
        const nodeObj = toRecord(node);
        if (nodeObj === null) return;

        const name = getFunctionName(nodeObj);
        if (name !== null && !containsWorldReference(nodeObj)) {
          context.report({
            node,
            messageId: 'functionMustUseWorld',
            data: { name },
          });
        }
      },

      ExportNamedDeclaration(node): void {
        const nodeObj = toRecord(node);
        if (nodeObj === null) return;

        const declaration = getObject(nodeObj, 'declaration');
        if (declaration === null) {
          return;
        }

        const declType = getString(declaration, 'type');

        // Skip FunctionDeclaration - already handled by FunctionDeclaration visitor
        if (declType === 'FunctionDeclaration') {
          return;
        }

        if (declType === 'VariableDeclaration') {
          const name = getVariableName(declaration);
          if (name !== null && !containsWorldReference(declaration)) {
            context.report({
              node,
              messageId: 'exportMustUseWorld',
              data: { name },
            });
          }
        }
      },
    };
  },
};

export default rule;
