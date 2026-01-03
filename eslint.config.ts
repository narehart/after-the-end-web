import js from '@eslint/js';
import type { Linter, ESLint } from 'eslint';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cssModules from 'eslint-plugin-css-modules';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import noCrossComponentCssImports from './eslint-rules/no-cross-component-css-imports.ts';
import noPlainClassnameLiterals from './eslint-rules/no-plain-classname-literals.ts';
import noComponentHelperFunctions from './eslint-rules/no-component-helper-functions.ts';
import oneFunctionPerUtilsFile from './eslint-rules/one-function-per-utils-file.ts';
import noScreamingSnakeConstants from './eslint-rules/no-screaming-snake-constants.ts';
import noFunctionsInConstants from './eslint-rules/no-functions-in-constants.ts';
import oneHookPerFile from './eslint-rules/one-hook-per-file.ts';
import typesInTypesDirectory from './eslint-rules/types-in-types-directory.ts';

// ESLint Plugin type requires only meta and rules - extracting these avoids
// type incompatibility with typescript-eslint's configs property
const tsPlugin: ESLint.Plugin = {
  meta: tseslint.meta,
  // @ts-expect-error -- typescript-eslint and ESLint have incompatible RuleContext types
  rules: tseslint.rules,
};

// Extract configs with runtime validation
const reactRecommended = reactPlugin.configs.flat['recommended'];
const reactJsxRuntime = reactPlugin.configs.flat['jsx-runtime'];

if (reactRecommended === undefined || reactJsxRuntime === undefined) {
  throw new Error('React ESLint plugin configs not found');
}

// Local plugin for custom rules
const localPlugin = {
  rules: {
    'no-cross-component-css-imports': noCrossComponentCssImports,
    'no-plain-classname-literals': noPlainClassnameLiterals,
    'no-component-helper-functions': noComponentHelperFunctions,
    'one-function-per-utils-file': oneFunctionPerUtilsFile,
    'no-screaming-snake-constants': noScreamingSnakeConstants,
    'no-functions-in-constants': noFunctionsInConstants,
    'one-hook-per-file': oneHookPerFile,
    'types-in-types-directory': typesInTypesDirectory,
  },
};

// Shared rules for both JS and TS
const sharedRules: Linter.RulesRecord = {
  'react/prop-types': 'off',
  'react/no-multi-comp': ['error', { ignoreStateless: false }],
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
    },
  ],
  'import/first': 'error',
  'import/no-duplicates': 'error',
  'import/newline-after-import': 'error',
  'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
  'max-statements': ['error', 20],
  complexity: ['error', 10],

  // CSS Modules - detect undefined classes (no-unused-class incompatible with classnames/bind)
  'css-modules/no-undef-class': ['error', { camelCase: true }],

  // Local rules - enforce component CSS module isolation
  'local/no-cross-component-css-imports': 'error',
  'local/no-plain-classname-literals': 'error',
  'local/no-component-helper-functions': 'error',
  'local/one-function-per-utils-file': 'error',
  'local/no-screaming-snake-constants': 'error',
  'local/no-functions-in-constants': 'error',
  'local/one-hook-per-file': 'error',
  'local/types-in-types-directory': 'error',
};

export default defineConfig([
  globalIgnores(['dist']),

  // Node.js scripts (hooks, tooling)
  {
    files: ['.claude/hooks/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // JavaScript/JSX files
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactRecommended,
      reactJsxRuntime,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      'css-modules': cssModules,
      local: localPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      ...sharedRules,
    },
  },

  // TypeScript/TSX files - STRICT configuration
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      reactRecommended,
      reactJsxRuntime,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'css-modules': cssModules,
      local: localPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      ...sharedRules,

      // Disable base rules that conflict with TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-shadow': 'off',

      // ============================================
      // TYPESCRIPT-ESLINT STRICT RULES
      // ============================================

      // Strict type checking
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // Consistency and best practices
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // Prevent common mistakes
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-array-delete': 'error',

      // Code quality
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',

      // Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'enum', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        { selector: 'typeParameter', format: ['PascalCase'], prefix: ['T', 'K', 'V', 'E'] },
      ],

      // Stricter alternatives to base rules
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],

      // Prevent problematic patterns
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

      // Method signatures
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/member-ordering': 'error',

      // Array types
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // Assertions
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],

      // Promise handling
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],

      // Prevent deprecated or problematic features
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': true,
          'ts-nocheck': true,
          'ts-check': false,
        },
      ],
    },
  },
]);
