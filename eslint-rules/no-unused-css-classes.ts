/**
 * ESLint rule: no-unused-css-classes
 *
 * Detects CSS module classes that are defined but not used in the paired TSX file.
 * Works with classnames/bind pattern: cx('class', { 'class--modifier': condition })
 * Handles: template literals in variables, cx passed to utilities, pseudo-selector classes
 */

import fs from 'node:fs';
import path from 'node:path';
import type { Rule } from 'eslint';

const FIRST_MATCH_INDEX = 1;
const FIRST_LINE = 1;
const FIRST_COLUMN = 0;

type AstNode = Record<string, unknown>;

function isObj(value: unknown): value is AstNode {
  return value !== null && value !== undefined && typeof value === 'object';
}

function str(obj: AstNode, key: string): string | null {
  const v = obj[key];
  return typeof v === 'string' ? v : null;
}

function arr(obj: AstNode, key: string): unknown[] | null {
  const v = obj[key];
  return Array.isArray(v) ? v : null;
}

interface CssClassInfo {
  hasStandaloneRule: boolean;
  hasPseudoRule: boolean;
  isDescendantOf: Set<string>;
}

function extractCssClasses(cssContent: string): Map<string, CssClassInfo> {
  const classes = new Map<string, CssClassInfo>();
  const getOrCreate = (name: string): CssClassInfo => {
    const existing = classes.get(name);
    if (existing !== undefined) return existing;
    const info = {
      hasStandaloneRule: false,
      hasPseudoRule: false,
      isDescendantOf: new Set<string>(),
    };
    classes.set(name, info);
    return info;
  };

  const standaloneRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)(?:\s*[,{]|\s*$)/gm;
  const pseudoRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*):[a-zA-Z-]+/g;
  const descendantRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s+\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g;

  let match;
  while ((match = standaloneRegex.exec(cssContent)) !== null) {
    const className = match[FIRST_MATCH_INDEX];
    if (className !== undefined) getOrCreate(className).hasStandaloneRule = true;
  }

  while ((match = pseudoRegex.exec(cssContent)) !== null) {
    const className = match[FIRST_MATCH_INDEX];
    if (className !== undefined) getOrCreate(className).hasPseudoRule = true;
  }

  while ((match = descendantRegex.exec(cssContent)) !== null) {
    const parent = match[FIRST_MATCH_INDEX];
    const child = match[FIRST_MATCH_INDEX + FIRST_MATCH_INDEX];
    if (parent !== undefined && child !== undefined) {
      getOrCreate(child).isDescendantOf.add(parent);
    }
  }

  return classes;
}

function getTemplatePrefix(node: AstNode): string | null {
  const quasis = arr(node, 'quasis');
  if (quasis === null || quasis.length === FIRST_COLUMN) return null;
  const first = quasis[FIRST_COLUMN];
  if (!isObj(first)) return null;
  const valueObj = first['value'];
  if (!isObj(valueObj)) return null;
  const raw = str(valueObj, 'raw');
  return raw !== null && raw.length > FIRST_COLUMN ? raw : null;
}

function addFromKey(key: AstNode, classes: Set<string>, prefixes: Set<string>): void {
  const t = str(key, 'type');
  if (t === 'Literal') {
    const v = str(key, 'value');
    if (v !== null) classes.add(v);
  } else if (t === 'Identifier') {
    const n = str(key, 'name');
    if (n !== null) classes.add(n);
  } else if (t === 'TemplateLiteral') {
    const p = getTemplatePrefix(key);
    if (p !== null) prefixes.add(p);
  }
}

function processObjectArg(arg: AstNode, classes: Set<string>, prefixes: Set<string>): void {
  const props = arr(arg, 'properties');
  if (props === null) return;
  for (const prop of props) {
    if (!isObj(prop) || str(prop, 'type') !== 'Property') continue;
    const key = prop['key'];
    if (isObj(key)) addFromKey(key, classes, prefixes);
  }
}

function processArg(arg: AstNode, classes: Set<string>, prefixes: Set<string>): void {
  const t = str(arg, 'type');
  if (t === 'Literal') {
    const v = str(arg, 'value');
    if (v !== null) classes.add(v);
  } else if (t === 'TemplateLiteral') {
    const p = getTemplatePrefix(arg);
    if (p !== null) prefixes.add(p);
  } else if (t === 'ObjectExpression') {
    processObjectArg(arg, classes, prefixes);
  }
}

function getCssFilePath(tsxFilename: string): string | null {
  if (!tsxFilename.includes(path.join('src', 'ui'))) return null;
  if (!tsxFilename.endsWith('.tsx')) return null;
  const cssPath = tsxFilename.replace('.tsx', '.module.css');
  return fs.existsSync(cssPath) ? cssPath : null;
}

function getDefaultImportName(specifiers: unknown[]): string | null {
  for (const spec of specifiers) {
    if (!isObj(spec) || str(spec, 'type') !== 'ImportDefaultSpecifier') continue;
    const local = spec['local'];
    if (isObj(local)) return str(local, 'name');
  }
  return null;
}

function handleImport(node: AstNode, stylesRef: { name: string | null }): void {
  const sourceObj = node['source'];
  if (!isObj(sourceObj)) return;
  const source = str(sourceObj, 'value');
  if (source === null) return;
  const specifiers = arr(node, 'specifiers');
  if (specifiers === null) return;
  const name = getDefaultImportName(specifiers);
  if (name !== null && source.endsWith('.module.css')) stylesRef.name = name;
}

function handleCxCall(node: AstNode, classes: Set<string>, prefixes: Set<string>): void {
  const args = arr(node, 'arguments');
  if (args === null) return;
  for (const arg of args) {
    if (isObj(arg)) processArg(arg, classes, prefixes);
  }
}

function isCxPassedToFunction(node: AstNode): boolean {
  const args = arr(node, 'arguments');
  if (args === null) return false;
  for (const arg of args) {
    if (isObj(arg) && str(arg, 'type') === 'Identifier' && str(arg, 'name') === 'cx') return true;
  }
  return false;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow unused CSS module classes in paired TSX files' },
    messages: { unusedClass: 'CSS class "{{className}}" is defined but never used.' },
    schema: [],
  },
  create(context): Rule.RuleListener {
    const cssFilePath = getCssFilePath(context.filename);
    if (cssFilePath === null) return {};

    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    const definedClasses = extractCssClasses(cssContent);
    if (definedClasses.size === FIRST_COLUMN) return {};

    const usedClasses = new Set<string>();
    const usedPrefixes = new Set<string>();
    const stylesRef: { name: string | null } = { name: null };
    let cxPassedToUtility = false;

    return {
      ImportDeclaration(node): void {
        if (isObj(node)) handleImport(node, stylesRef);
      },
      CallExpression(node): void {
        if (!isObj(node)) return;
        const callee = node.callee;
        if (!isObj(callee)) return;

        if (str(callee, 'type') === 'Identifier' && str(callee, 'name') === 'cx') {
          handleCxCall(node, usedClasses, usedPrefixes);
        } else if (isCxPassedToFunction(node)) {
          cxPassedToUtility = true;
        }
      },
      TemplateLiteral(node): void {
        if (!isObj(node)) return;
        const prefix = getTemplatePrefix(node);
        if (prefix !== null) usedPrefixes.add(prefix);
      },
      MemberExpression(node): void {
        if (!isObj(node)) return;
        const obj = node.object;
        if (!isObj(obj) || str(obj, 'type') !== 'Identifier') return;
        if (str(obj, 'name') !== stylesRef.name) return;
        const prop = node.property;
        if (!isObj(prop)) return;
        const t = str(prop, 'type');
        if (t === 'Identifier') {
          const n = str(prop, 'name');
          if (n !== null) usedClasses.add(n);
        } else if (t === 'Literal') {
          const v = str(prop, 'value');
          if (v !== null) usedClasses.add(v);
        }
      },
      'Program:exit'(): void {
        if (cxPassedToUtility) return;

        const isClassUsed = (name: string): boolean => {
          if (usedClasses.has(name)) return true;
          return Array.from(usedPrefixes).some((p) => name.startsWith(p));
        };

        for (const [className, info] of definedClasses) {
          if (info.hasPseudoRule && !info.hasStandaloneRule) continue;
          const hasUsedParent = Array.from(info.isDescendantOf).some((p) => isClassUsed(p));
          if (hasUsedParent) continue;
          if (!isClassUsed(className)) {
            context.report({
              loc: { line: FIRST_LINE, column: FIRST_COLUMN },
              messageId: 'unusedClass',
              data: { className },
            });
          }
        }
      },
    };
  },
};

export default rule;
