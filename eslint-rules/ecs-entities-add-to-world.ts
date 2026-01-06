/**
 * ESLint rule: ecs-entities-add-to-world
 *
 * Enforces that all functions in src/ecs/entities/ reference the ECS world.
 * This ensures entity files only contain entity factories, not pure utilities.
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

function toRecord(value: unknown): Record<string, unknown> | null {
  return isNonNullObject(value) ? value : null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that functions in ecs/entities/ reference the ECS world',
    },
    messages: {
      functionMustUseWorld:
        "Function '{{name}}' does not reference ECS world. Entity files should only contain entity factories. Move pure utilities elsewhere.",
    },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const filename = context.filename;

    // Only check files in src/ecs/entities/
    if (!filename.includes(path.join('src', 'ecs', 'entities'))) {
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
    };
  },
};

export default rule;
