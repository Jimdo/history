import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['modules/**/*.js'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: { ...globals.browser, process: 'readonly' }
    },
    rules: {
      // Match the defaults of the eslint 3 config this replaced.
      'no-alert': 'error',
      'no-console': 'error',
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'prefer-arrow-callback': 'error'
    }
  },
  {
    files: ['modules/__tests__/**/*.js'],
    languageOptions: {
      globals: { ...globals.jest }
    }
  }
];
