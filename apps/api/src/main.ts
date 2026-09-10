import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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

const start = async (): Promise<void> => {
  await connectToMongo(env.mongoUri);

  await ensureSearchIndex();

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

  const typeDefs = readFileSync(
    join(__dirname, '../../../packages/shared/src/graphql/schema.graphql'),
    'utf-8',
  );

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers: noteResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

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