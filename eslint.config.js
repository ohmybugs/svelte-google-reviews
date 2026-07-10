import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.js', '**/*.ts'],
    ...js.configs.recommended,
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@typescript-eslint': ts },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: { parser: tsParser },
      globals: { ...globals.browser },
    },
    plugins: { svelte, '@typescript-eslint': ts },
    rules: {
      ...svelte.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.svelte-kit/',
      'storybook-static/',
      'react-google-reviews/',
    ],
  },
];
