import { toGraphQLNote } from '../mapper/note-mapper.js';
import type { GraphQLContext } from '../context.js';
import type { Resolvers } from '../../../generated/resolvers.js';

export const noteResolvers: Resolvers<GraphQLContext> = {
  Query: {
    notes: async (_parent, _args, { useCases }) => {
      const notes = await useCases.listNotes.execute();
      return notes.map(toGraphQLNote);
    },

    note: async (_parent, { id }, { useCases }) => {
      const note = await useCases.getNote.execute(id);
      
      return toGraphQLNote(note);
    },

    searchNotes: async (_parent, { input }, { useCases }) => {
      const result = await useCases.searchNotes.execute({
        query: input.query,
        tags: input.tags ?? undefined,
        limit: input.limit ?? undefined,
        skip: input.skip ?? undefined,
      });

      return {
        notes: result.notes.map(toGraphQLNote),
        total: result.total,
      };
    },

    searchNotesWithFacets: async (_parent, { input }, { useCases }) => {
      const result = await useCases.searchNotesWithFacets.execute({
        query: input.query,
        tags: input.tags ?? undefined,
        limit: input.limit ?? undefined,
        skip: input.skip ?? undefined,
      });

      return {
        notes: result.notes.map(toGraphQLNote),
        total: result.total,
        facets: result.facets,
      };
    },

    autocompleteNotes: async (_parent, { prefix, limit }, { useCases }) => {
      return useCases.autocompleteNotes.execute(prefix, limit ?? undefined);
    },
  },

  Mutation: {
    createNote: async (_parent, { input }, { useCases }) => {
      const note = await useCases.createNote.execute({
        title: input.title,
        content: input.content,
        tags: input.tags ?? [],
      });

      return toGraphQLNote(note);
    },

    updateNote: async (_parent, { id, input }, { useCases }) => {
      const note = await useCases.updateNote.execute(id, {
        title: input.title ?? undefined,
        content: input.content ?? undefined,
        tags: input.tags ?? undefined,
      });

      return toGraphQLNote(note);
    },

    deleteNote: async (_parent, { id }, { useCases }) => {
      return useCases.deleteNote.execute(id);
    },
  },

  DateTime: {
    serialize: (value: string | Date) => (value instanceof Date ? value.toISOString() : value),
    parseValue: (value: string) => new Date(value),
    parseLiteral: (ast) => (ast.kind === 'StringValue' ? new Date(ast.value) : new Date()),
  },
};