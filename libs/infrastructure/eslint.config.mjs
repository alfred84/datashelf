import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}'],
          // Generated Prisma client imports @prisma/client/runtime at runtime; source uses
          // ../../generated/prisma/client. pg is required by @prisma/adapter-pg at runtime.
          ignoredDependencies: ['@prisma/client', 'pg'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
