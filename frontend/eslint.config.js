import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    {
        ignores: [
            "node_modules/",
            "dist/",
            "coverage/"
        ]
    },

    js.configs.recommended,

    {
        files: [
            "src/**/*.js",
            "src/**/*.jsx"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly"
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },

        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
        },

        rules: {
            ...reactHooks.configs.recommended.rules,

            "react-refresh/only-export-components": [
                "warn",
                {
                    allowConstantExport: true
                }
            ],

            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ]
        }
    }
];