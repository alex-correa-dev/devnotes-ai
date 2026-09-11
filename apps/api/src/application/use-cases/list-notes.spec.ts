import { describe, it, expect, beforeEach } from 'vitest';
import { ListNotesUseCase } from './list-notes.js';
import { CreateNoteUseCase } from './create-note.js';
import { InMemoryNoteRepository } from '../../infra/repositories/in-memory-note-repository.js';

describe('ListNotesUseCase', () => {
  let repository: InMemoryNoteRepository;
  let listNotes: ListNotesUseCase;
  let createNote: CreateNoteUseCase;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
    listNotes = new ListNotesUseCase(repository);
    createNote = new CreateNoteUseCase(repository);
  });

  it('returns an empty array when there are no notes', async () => {
    const notes = await listNotes.execute();
    expect(notes).toEqual([]);
  });

  it('returns all persisted notes', async () => {
    await createNote.execute({ title: 'Nota A', content: 'Conteúdo A' });
    await createNote.execute({ title: 'Nota B', content: 'Conteúdo B' });
    await createNote.execute({ title: 'Nota C', content: 'Conteúdo C' });

    const notes = await listNotes.execute();

    expect(notes).toHaveLength(3);
    expect(notes.map((n) => n.toObject().title).sort()).toEqual([
      'Nota A',
      'Nota B',
      'Nota C',
    ]);
  });

  it('returns the notes with all their properties intact', async () => {
    await createNote.execute({
      title: 'Nota com tags',
      content: 'Conteúdo',
      tags: ['node', 'graphql'],
    });

    const [note] = await listNotes.execute();
    const obj = note.toObject();

    expect(obj.title).toBe('Nota com tags');
    expect(obj.content).toBe('Conteúdo');
    expect(obj.tags).toEqual(['node', 'graphql']);
    expect(obj.id).toBeDefined();
    expect(obj.createdAt).toBeInstanceOf(Date);
    expect(obj.updatedAt).toBeInstanceOf(Date);
  });
});