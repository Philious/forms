import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import { parser as tsParser } from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { resolve } from "path";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve("./tsconfig.json"),
        sourceType: "module",
      },
    },
    plugins: {
      "@angular-eslint": angular,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...angular.configs.recommended.rules,
      ...angular.configs["template/process-inline-templates"].rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/no-invalid-this": ["warn"],
      "@angular-eslint/no-host-metadata-property": "off",
    },
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: angularTemplate.parsers[".html"],
      sourceType: "module",
    },
    plugins: {
      "@angular-eslint/template": angularTemplate,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angular.configs.templateAccessibility,
    },
  },
];
