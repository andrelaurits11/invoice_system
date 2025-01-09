import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// Faili ja kataloogi nime konteksti määramine
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ESLint-i ühilduvusrežiimi seadistamine
const compat = new FlatCompat({
  baseDirectory: __dirname, // Baaskataloog konfigureerimiseks
});

// ESLint konfiguratsioon koos Next.js, TypeScripti ja Prettieri integreerimisega
const eslintConfig = [
  // Laiendatud konfiguratsioonid Next.js, TypeScripti ja Prettieri reeglitele
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // Lisab Prettieri integreerimise
  ),
  {
    // Linteri üldised valikud
    linterOptions: {
      reportUnusedDisableDirectives: true, // Märku annab kasutamata "eslint-disable" kommentaaridest
    },
    // Kohandatud reeglid
    rules: {
      // Annab hoiatuse kasutamata muutujate eest
      '@typescript-eslint/no-unused-vars': 'warn',
      // Lülitab välja hoiatused "any" tüübi kasutamisel
      '@typescript-eslint/no-explicit-any': 'off',
      // Keelab vajaduse importida React JSX-i kasutamisel (Next.js jaoks)
      'react/react-in-jsx-scope': 'off',
      // Kuvab hoiatuse konsoolilogi kasutamisel
      'no-console': 'warn',
      // Prettieri reeglid koodi vormindamiseks
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // Kasutab ühekordseid jutumärke
          semi: true, // Lisab semikoolonid lause lõppu
          trailingComma: 'es5', // Lisab koma viimasele elemendile ES5 jaoks
        },
      ],
    },
  },
];

export default eslintConfig;
