import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../../packages/shared/src/graphql/schema.graphql',
  generates: {
    './src/generated/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../presentation/graphql/context#GraphQLContext',
        useIndexSignature: true,
      },
    },
  },
};

export default config;