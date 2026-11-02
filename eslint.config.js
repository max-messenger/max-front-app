import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'cli/dist', 'cli/template']),
  {
    files: ['**/*.{ts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      stylistic.configs.recommended
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic
    },
    rules: {
      // Запрет any
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // Неиспользуемые переменные
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }
      ],

      // Сортировка импортов
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Стилистика / форматирование
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'never'],
      // Длина строки (игнорируем длинные литералы: строки, шаблонные строки и регулярки)
      '@stylistic/max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],

      // Пробелы внутри фигурных скобок (объекты, импорты, экспорты, деструктуризация)
      '@stylistic/object-curly-spacing': ['error', 'always'],

      // Перенос фигурных скобок объекта/деструктуризации на новые строки при 2+ свойствах
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, minProperties: 4, consistent: true },
          ObjectPattern: { multiline: true, minProperties: 4, consistent: true },
          ImportDeclaration: { multiline: true, minProperties: 10, consistent: true },
          ExportDeclaration: { multiline: true, minProperties: 10, consistent: true }
        }
      ],

      // Каждое свойство объекта на отдельной строке
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],

      // Каждый дочерний JSX-элемент на отдельной строке
      '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'non-jsx' }],
      // JSX в скобках на новой строке (return, arrow, logical, condition, declaration, assignment)
      '@stylistic/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'ignore',
          propertyValue: 'ignore'
        }
      ],
      '@stylistic/comma-dangle': 'off',
      '@stylistic/space-infix-ops': ['error', { ignoreTypes: false }],
      '@stylistic/brace-style': ['error', '1tbs'],
      // Прочее
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-else-return': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ]
    }
  },
  {
    files: ['cli/src/**/*.ts'],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      'no-console': 'off'
    }
  }
])
