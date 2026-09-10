import type { Note } from '../../../domain/entities/note.js';
import type { Note as GraphQLNote } from '@devnotes/shared';

export const toGraphQLNote = (note: Note): GraphQLNote => {
  const obj = note.toObject();

  return {
    id: obj.id,
    title: obj.title,
    content: obj.content,
    tags: obj.tags,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString(),
  };
};