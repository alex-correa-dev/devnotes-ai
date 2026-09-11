import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { env } from './config/env.js';
import { connectToMongo, disconnectFromMongo } from './infra/database/mongoose/connection.js';
import { MongoNoteRepository } from './infra/repositories/mongo-note-repository.js';
import {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
  SearchNotesUseCase,
  SearchNotesWithFacetsUseCase,
  AutocompleteNotesUseCase,
} from './application/use-cases/index.js';
import { noteResolvers } from './presentation/graphql/resolvers/note-resolver.js';
import type { GraphQLContext } from './presentation/graphql/context.js';
import { ensureSearchIndex } from './infra/database/mongoose/search-index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const findSchemaPath = (): string => {
  const candidates = [
    // Dev: apps/api/src/ -> ../../../packages/shared/...
    resolve(__dirname, '../../../packages/shared/src/graphql/schema.graphql'),
    // Prod: apps/api/dist/ -> ../../packages/shared/...
    resolve(__dirname, '../../packages/shared/src/graphql/schema.graphql'),
    // Fallback: relative to the process working directory (/app in Docker)
    resolve(process.cwd(), 'packages/shared/src/graphql/schema.graphql'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Could not locate schema.graphql. Tried:\n${candidates.join('\n')}`,
  );
};

const start = async (): Promise<void> => {
  await connectToMongo(env.mongoUri);

  ensureSearchIndex().catch((error) => {
    console.error('Search index initialization failed:', error);
  });
  
  // --- Composition root ---
  const noteRepository = new MongoNoteRepository();
  const useCases = {
    createNote: new CreateNoteUseCase(noteRepository),
    listNotes: new ListNotesUseCase(noteRepository),
    getNote: new GetNoteUseCase(noteRepository),
    updateNote: new UpdateNoteUseCase(noteRepository),
    deleteNote: new DeleteNoteUseCase(noteRepository),
    searchNotes: new SearchNotesUseCase(noteRepository),
    searchNotesWithFacets: new SearchNotesWithFacetsUseCase(noteRepository),
    autocompleteNotes: new AutocompleteNotesUseCase(noteRepository),
  };

  const typeDefs = readFileSync(findSchemaPath(), 'utf-8');

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers: noteResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, { context: async () => ({ useCases }) }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: env.port }, resolve));

  console.log(`🚀 GraphQL ready at http://localhost:${env.port}/graphql`);

  const shutdown = async (): Promise<void> => {
    await server.stop();
    await disconnectFromMongo();

    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

start().catch((error) => {
  console.error('Failed to start server:', error);

  process.exit(1);
});