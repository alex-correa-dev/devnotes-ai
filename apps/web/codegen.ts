import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../packages/shared/src/graphql/schema.graphql',
  documents: ['./src/**/*.graphql'],
  generates: {
    './src/lib/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
