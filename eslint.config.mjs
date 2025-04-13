import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
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
      '@angular-eslint': angular,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...angular.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/no-invalid-this': ['warn'],
      '@angular-eslint/no-host-metadata-property': 'off',
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: await angularTemplate.defineParser,
      sourceType: 'module',
    },
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angular.configs.templateAccessibility,
    },
  },
];
