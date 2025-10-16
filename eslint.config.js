import js from '@eslint/js';
import globals from 'globals';
import yml from 'eslint-plugin-yml';
import yamlParser from 'yaml-eslint-parser';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'bundles/**',
      'coverage/**',
      '.git/**',
      'tmp/**',
      'temp/**',
      '*.min.js',
    ],
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2024,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off', // CLI tool needs console
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-duplicate-imports': 'error',
      'no-useless-constructor': 'warn',
      'no-useless-rename': 'warn',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'all'],
      'max-len': [
        'warn',
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },

  // YAML files
  {
    files: ['**/*.yaml', '**/*.yml'],
    plugins: {
      yml,
    },
    languageOptions: {
      parser: yamlParser,
    },
    rules: {
      ...yml.configs.recommended.rules,
      ...yml.configs.prettier.rules,
      'yml/no-empty-mapping-value': 'off',
      'yml/quotes': ['warn', { prefer: 'double', avoidEscape: true }],
      'yml/no-multiple-empty-lines': ['warn', { max: 1 }],
      'yml/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
      'yml/indent': ['warn', 2],
    },
  },

  // Test files (when added)
  {
    files: ['**/*.test.js', '**/*.spec.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },
];
