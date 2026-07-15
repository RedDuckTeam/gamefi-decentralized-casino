module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import', '@typescript-eslint', 'prettier', 'react', 'react-hooks', '@tanstack/query'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ['error', {allow: ['warn', 'error']}],
    'react-refresh/only-export-components': [
      'warn',
      {allowConstantExport: true},
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          'external',
          'builtin',
          'index',
          'sibling',
          'parent',
          'internal',
          'object',
        ],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {fixStyle: 'inline-type-imports'},
    ],
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        endOfLine: 'auto',
        jsxSingleQuote: false,
        printWidth: 80,
        semi: true,
        useTabs: false,
        tabWidth: 2,
        trailingComma: 'all',
        singleQuote: true,
      },
    ],
  },
}
