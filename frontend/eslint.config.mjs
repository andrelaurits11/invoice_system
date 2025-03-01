import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    'next/core-web-vitals', // Next.js reeglid
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off', // Kui kasutate Next.js
    },
  },
];
