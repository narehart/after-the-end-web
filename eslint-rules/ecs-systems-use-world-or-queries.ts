/**
 * ESLint rule: ecs-systems-use-world-or-queries
 *
 * Enforces that all functions in src/ecs/systems/ reference either:
 * - The ECS world directly, OR
 * - Query functions imported from queries/
 *
 * This ensures system files only contain ECS logic, not pure utilities.
 */

import path from 'node:path';
import type { Rule } from 'eslint';

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

function isTargetIdentifier(node: Record<string, unknown>, targets: Set<string>): boolean {
  if (getString(node, 'type') !== 'Identifier') return false;
  const name = getString(node, 'name');
  return name !== null && targets.has(name);
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

function containsTargetReference(node: Record<string, unknown>, targets: Set<string>): boolean {
  if (isTargetIdentifier(node, targets)) {
    return true;
  }

  const children = getNodeChildren(node);
  for (const child of children) {
    if (containsTargetReference(child, targets)) {
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

function toRecord(value: unknown): Record<string, unknown> | null {
  return isNonNullObject(value) ? value : null;
}

function isQueryImport(source: string): boolean {
  return source.includes('/queries/') || source.includes('/queries');
}

function getImportSource(nodeObj: Record<string, unknown>): string | null {
  const source = getObject(nodeObj, 'source');
  if (source === null) return null;
  return getString(source, 'value');
}

function getSpecifiers(nodeObj: Record<string, unknown>): unknown[] {
  if (!hasProperty(nodeObj, 'specifiers')) return [];
  const specifiers = nodeObj.specifiers;
  return Array.isArray(specifiers) ? specifiers : [];
}

function extractImportedName(spec: unknown): string | null {
  if (!isNonNullObject(spec)) return null;
  const local = getObject(spec, 'local');
  if (local === null) return null;
  return getString(local, 'name');
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that functions in ecs/systems/ reference world or query functions',
    },
    messages: {
      functionMustUseWorldOrQueries:
        "Function '{{name}}' does not reference ECS world or query functions. System files should only contain ECS logic. Move pure utilities elsewhere.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/systems/
    if (!filename.includes(path.join('src', 'ecs', 'systems'))) {
      return {};
    }

    // Track valid identifiers: 'world' + any imports from queries
    const validIdentifiers = new Set<string>([WORLD_IDENTIFIER]);

    return {
      ImportDeclaration(node): void {
        const nodeObj = toRecord(node);
        if (nodeObj === null) return;

        const sourcePath = getImportSource(nodeObj);
        if (sourcePath === null || !isQueryImport(sourcePath)) return;

        for (const spec of getSpecifiers(nodeObj)) {
          const name = extractImportedName(spec);
          if (name !== null) {
            validIdentifiers.add(name);
          }
        }
      },

      FunctionDeclaration(node): void {
        const nodeObj = toRecord(node);
        if (nodeObj === null) return;

        const name = getFunctionName(nodeObj);
        if (name !== null && !containsTargetReference(nodeObj, validIdentifiers)) {
          context.report({
            node,
            messageId: 'functionMustUseWorldOrQueries',
            data: { name },
          });
        }
      },
    };
  },
};

export default rule;
