import { baseConfig } from '@devnotes/config/eslint';

export default [
  ...baseConfig,
  {
    ignores: ['src/generated/**'],
  },
];