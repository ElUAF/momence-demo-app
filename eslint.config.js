import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
// 👇 Import the Prettier config
import prettierConfig from 'eslint-config-prettier'
// 👇 Import the Prettier plugin to surface formatting issues via ESLint
import prettierPlugin from 'eslint-plugin-prettier'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Report Prettier formatting issues as ESLint errors
            'prettier/prettier': 'error',
        },
    },

    // 👇 Add Prettier config as the very last item in the array.
    //    This disables all formatting rules that conflict with Prettier.
    prettierConfig,
])