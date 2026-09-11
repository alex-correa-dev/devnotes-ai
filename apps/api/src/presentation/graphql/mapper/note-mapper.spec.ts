import { describe, it, expect } from 'vitest';
import { toGraphQLNote } from './note-mapper.js';
import { Note } from '../../../domain/entities/note.js';

describe('toGraphQLNote', () => {
  it('maps a persisted note to the GraphQL contract', () => {
    const note = Note.restore({
      id: 'note-id',
      title: 'Título',
      content: 'Conteúdo',
      tags: ['node', 'mongo'],
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: new Date('2026-01-02T10:00:00Z'),
    });

    const result = toGraphQLNote(note);

    expect(result).toEqual({
      id: 'note-id',
      title: 'Título',
      content: 'Conteúdo',
      tags: ['node', 'mongo'],
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-02T10:00:00.000Z',
    });
  });

  it('serializes dates as ISO 8601 strings', () => {
    const note = Note.restore({
      id: 'note-id',
      title: 'Título',
      content: 'Conteúdo',
      tags: [],
      createdAt: new Date('2026-03-15T14:30:00.000Z'),
      updatedAt: new Date('2026-03-15T14:30:00.000Z'),
    });

    const result = toGraphQLNote(note);

    expect(result.createdAt).toBe('2026-03-15T14:30:00.000Z');
    expect(typeof result.createdAt).toBe('string');
  });

  it('throws when the note has not been persisted yet', () => {
    const note = Note.create({ title: 'Não persistida', content: 'Conteúdo' });

    expect(() => toGraphQLNote(note)).toThrow('Cannot map a Note without an id to GraphQL');
  });
});
