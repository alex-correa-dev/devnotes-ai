import { describe, it, expect, beforeEach } from 'vitest';
import { GetNoteUseCase } from './get-note.js';
import { CreateNoteUseCase } from './create-note.js';
import { InMemoryNoteRepository } from '../../infra/repositories/in-memory-note-repository.js';

describe('GetNoteUseCase', () => {
  let repository: InMemoryNoteRepository;
  let getNote: GetNoteUseCase;
  let createNote: CreateNoteUseCase;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
    getNote = new GetNoteUseCase(repository);
    createNote = new CreateNoteUseCase(repository);
  });

  it('returns the note when it exists', async () => {
    const created = await createNote.execute({
      title: 'Nota existente',
      content: 'Conteúdo',
    });

    const found = await getNote.execute(created.id!);

    expect(found.toObject().title).toBe('Nota existente');
  });

  it('throws NotFoundError when the note does not exist', async () => {
    await expect(getNote.execute('non-existent-id')).rejects.toThrow(
      'Note with id "non-existent-id" was not found',
    );
  });
});