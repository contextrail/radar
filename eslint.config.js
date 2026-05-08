import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "docs/.vitepress/dist/**",
      "docs/.vitepress/cache/**",
      "node_modules/**",
      "coverage/**",
      "release/**",
      "*.tgz",
    ],
  },
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  eslintConfigPrettier,
);
