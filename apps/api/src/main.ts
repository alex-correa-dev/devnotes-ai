import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { env } from './config/env.js';
import { InMemoryNoteRepository } from './infra/repositories/in-memory-note-repository.js';
import {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
} from './application/use-cases/index.js';
import { noteResolvers } from './presentation/graphql/resolvers/note-resolver.js';
import type { GraphQLContext } from './presentation/graphql/context.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Composition root ---
// Dependency injection happens here, at the boundary of the application.
const noteRepository = new InMemoryNoteRepository();

const useCases = {
  createNote: new CreateNoteUseCase(noteRepository),
  listNotes: new ListNotesUseCase(noteRepository),
  getNote: new GetNoteUseCase(noteRepository),
  updateNote: new UpdateNoteUseCase(noteRepository),
  deleteNote: new DeleteNoteUseCase(noteRepository),
};

const typeDefs = readFileSync(
  join(__dirname, '../../../packages/shared/src/graphql/schema.graphql'),
  'utf-8',
);

const start = async (): Promise<void> => {
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
    expressMiddleware(server, {
      context: async () => ({ useCases }),
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.port }, resolve),
  );

  console.log(`🚀 GraphQL ready at http://localhost:${env.port}/graphql`);
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});