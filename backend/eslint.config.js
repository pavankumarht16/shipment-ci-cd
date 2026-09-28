import js from "@eslint/js";

export default [
    {
        ignores: [
            "node_modules/",
            "src/generated/",
            "coverage/",
            "dist/"
        ]
    },

    js.configs.recommended,

    {
        files: [
            "src/**/*.js",
            "tests/**/*.js"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                process: "readonly",
                console: "readonly"
            }
        },

        rules: {
            "no-console": "off",

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