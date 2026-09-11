import { Note } from '../../domain/entities/note.js';

export const makeNote = (
  overrides: Partial<{
    title: string;
    content: string;
    tags: string[];
  }> = {},
): Note => {
  return Note.create({
    title: overrides.title ?? 'Título de teste',
    content: overrides.content ?? 'Conteúdo de teste',
    tags: overrides.tags ?? [],
  });
};
