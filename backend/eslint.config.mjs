import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

import { resolve } from 'path';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve('./tsconfig.json'),
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,

      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-invalid-this': ['warn'],
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
  eslintConfigPrettier,
];
