import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    extends: ['prettier'],
    plugins: ['prettier'],
  }),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'public/**',
      'next-env.d.ts',
      'next.config.js',
      'postcss.config.mjs',
      '*.config.js',
      '*.config.mjs',
      'scripts/**',
    ],
  },
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'after-used',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // General rules
      'prefer-const': 'error',
      'no-var': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
]

export default eslintConfig
