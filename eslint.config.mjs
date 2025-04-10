import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['**/node_modules/', '**/dist/'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'no-commonjs': 'off',
      'prefer-import': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ],

      'no-console': 'warn',
      'no-unused-vars': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error'
    }
  }
])
