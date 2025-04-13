// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser, // Adds browser globals like 'document'
                ...globals.node     // Adds Node.js globals if needed
            }
        },
        rules: {
            "quotes": ["error", "double"], // Enforces double quotes
            "semi": ["error", "always"]    // Enforces semicolons
        }
    }
];