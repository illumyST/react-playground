import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

// Prettier integration (keeps last for formatting)
const prettierRecommended = require('eslint-plugin-prettier/recommended');

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  prettierRecommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    plugins: {
      react,
    },
    rules: {
      // React 19: allow prop spreading but warn if excessive
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['warn', { allowReferrer: true }],

      // TypeScript / general
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // Import ordering (simple grouping)
      'sort-imports': [
        'warn',
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
        },
      ],
      'import/order': [
        'off',
      ],
    },
  },
]);
