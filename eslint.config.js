import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import cssModules from 'eslint-plugin-css-modules';
import { defineConfig, globalIgnores } from 'eslint/config';
import noCrossComponentCssImports from './eslint-rules/no-cross-component-css-imports.js';
import noPlainClassnameLiterals from './eslint-rules/no-plain-classname-literals.js';

// Local plugin for custom rules
const localPlugin = {
  rules: {
    'no-cross-component-css-imports': noCrossComponentCssImports,
    'no-plain-classname-literals': noPlainClassnameLiterals,
  },
};

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
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
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
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
    },
  },
]);
