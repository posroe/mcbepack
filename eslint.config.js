import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/templates/**",
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            globals: {
                ...globals.bun,
                ...globals.node
            }
        },
        plugins: {
            "simple-import-sort": simpleImportSort
        },
        rules: {
            "@typescript-eslint/no-namespace": ["error", {
                allowDeclarations: true
            }],
            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": ["error", {
                groups: [
                    ["^\\u0000"],
                    ["^node:"],
                    ["^(?!@mcbepack/)@?\\w"],
                    ["^@mcbepack/"],
                    ["^\\."]
                ]
            }]
        }
    }
);
