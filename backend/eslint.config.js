import js from '@eslint/js'; // standard rules for regular JS
import tseslint from 'typescript-eslint'; //Tool that enables so ESLint understans TS and can read the tsconfig-files
import eslintConfigPrettier from 'eslint-config-prettier'; // ensures no quality rules fight with Prettier's formatting

export default tseslint.config([
  // ignores the finished(?) code that we've built,, shouldn't be linted
  { ignores: ['dist'] },
  {
    // tells the confguration the type of files the are made for.
    files: ['**/*.ts'],
    // we import ready made packages with their own rules
    extends: [
      js.configs.recommended, // Standardrules for good JS-practice.
      ...tseslint.configs.strictTypeChecked, // strictest of TS-typings.
      ...tseslint.configs.stylisticTypeChecked, // forces a neat and modern codestyle in TS
      eslintConfigPrettier, // Turns off rules that clash with Prettier
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // Gives ESLint access to our TS-settings, so the lint knows exactly what types the variables have.
        tsconfigRootDir: import.meta.dirname, // Forces ESLint to look for the tsconfig.json in the exact map where eslint.config.ts is. Great to use when having FE and BE in different maps.
      },
    },
    rules: {
      // customising rules and override standard rules
      '@typescript-eslint/explicit-function-return-type': 'error', //forces us to write out what functions return
      '@typescript-eslint/explicit-module-boundary-types': 'error', // forces us to create extremly clear types on functions which are going to be exported from a file. This ensures that if a file imports that function, the developer and TS can see the exact argument needed and what's being returned, without opening the other file and reading the code.

      '@typescript-eslint/no-explicit-any': 'error', // 'any' is completely forbidden

      'no-console': 'off', //allows console.log/error, kept it in the code to show my troubleshooting process

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // handles unused variables, but they're allowed if they begin with an underscore e.g. request in Express
    },
  },
]);
