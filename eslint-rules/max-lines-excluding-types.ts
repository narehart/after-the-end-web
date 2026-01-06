/**
 * max-lines-excluding-types
 *
 * Like ESLint's max-lines, but excludes interface and type alias definitions.
 * Allows colocating Props/Return interfaces without inflating line count.
 */

import type { Rule } from 'eslint';
import type { Node } from 'estree';

const MAX_LINES_DEFAULT = 250;
const FIRST_LINE = 1;
const FIRST_INDEX = 0;

interface RuleOptions {
  max?: number;
  skipBlankLines?: boolean;
  skipComments?: boolean;
}

interface LineRange {
  start: number;
  end: number;
}

function isTypeDefinitionLine(lineNumber: number, typeRanges: LineRange[]): boolean {
  for (const range of typeRanges) {
    if (lineNumber >= range.start && lineNumber <= range.end) {
      return true;
    }
  }
  return false;
}

function collectCommentLines(sourceCode: Rule.RuleContext['sourceCode']): Set<number> {
  const commentLines = new Set<number>();
  const comments = sourceCode.getAllComments();

  for (const comment of comments) {
    if (comment.loc !== undefined && comment.loc !== null) {
      for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
        commentLines.add(i);
      }
    }
  }
  return commentLines;
}

function shouldSkipLine(
  line: string,
  lineNumber: number,
  typeRanges: LineRange[],
  commentLines: Set<number>,
  skipBlankLines: boolean,
  skipComments: boolean
): boolean {
  if (isTypeDefinitionLine(lineNumber, typeRanges)) return true;
  if (skipBlankLines && line.trim() === '') return true;
  if (skipComments && commentLines.has(lineNumber)) return true;
  return false;
}

function countNonTypeLines(
  lines: string[],
  typeRanges: LineRange[],
  commentLines: Set<number>,
  skipBlankLines: boolean,
  skipComments: boolean
): number {
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + FIRST_LINE;
    const line = lines[i];
    if (line === undefined) continue;
    if (!shouldSkipLine(line, lineNumber, typeRanges, commentLines, skipBlankLines, skipComments)) {
      count++;
    }
  }
  return count;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce max lines excluding type definitions',
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'number' },
          skipBlankLines: { type: 'boolean' },
          skipComments: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const rawOptions: unknown = context.options[FIRST_INDEX] ?? {};
    const options: RuleOptions =
      typeof rawOptions === 'object' && rawOptions !== null ? rawOptions : {};
    const maxLines = options.max ?? MAX_LINES_DEFAULT;
    const skipBlankLines = options.skipBlankLines ?? false;
    const skipComments = options.skipComments ?? false;

    const sourceCode = context.sourceCode;
    const typeRanges: LineRange[] = [];

    return {
      TSInterfaceDeclaration(node: Node): void {
        if (node.loc !== undefined && node.loc !== null) {
          typeRanges.push({ start: node.loc.start.line, end: node.loc.end.line });
        }
      },
      TSTypeAliasDeclaration(node: Node): void {
        if (node.loc !== undefined && node.loc !== null) {
          typeRanges.push({ start: node.loc.start.line, end: node.loc.end.line });
        }
      },
      'Program:exit'(): void {
        const commentLines = skipComments ? collectCommentLines(sourceCode) : new Set<number>();
        const countedLines = countNonTypeLines(
          sourceCode.lines,
          typeRanges,
          commentLines,
          skipBlankLines,
          skipComments
        );

        if (countedLines > maxLines) {
          context.report({
            loc: { line: FIRST_LINE, column: FIRST_INDEX },
            message: `File has too many lines (${String(countedLines)} excluding types). Maximum allowed is ${String(maxLines)}.`,
          });
        }
      },
    };
  },
};

export default rule;
