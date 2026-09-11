import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteNoteUseCase } from './delete-note.js';
import { CreateNoteUseCase } from './create-note.js';
import { GetNoteUseCase } from './get-note.js';
import { ListNotesUseCase } from './list-notes.js';
import { InMemoryNoteRepository } from '../../infra/repositories/in-memory-note-repository.js';

describe('DeleteNoteUseCase', () => {
  let repository: InMemoryNoteRepository;
  let deleteNote: DeleteNoteUseCase;
  let createNote: CreateNoteUseCase;
  let getNote: GetNoteUseCase;
  let listNotes: ListNotesUseCase;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
    deleteNote = new DeleteNoteUseCase(repository);
    createNote = new CreateNoteUseCase(repository);
    getNote = new GetNoteUseCase(repository);
    listNotes = new ListNotesUseCase(repository);
  });

  it('deletes an existing note and returns true', async () => {
    const created = await createNote.execute({
      title: 'Para deletar',
      content: 'Conteúdo',
    });

    const result = await deleteNote.execute(created.id!);
    expect(result).toBe(true);
  });

  it('removes the note so a subsequent read fails', async () => {
    const created = await createNote.execute({
      title: 'Para deletar',
      content: 'Conteúdo',
    });

    await deleteNote.execute(created.id!);

    await expect(getNote.execute(created.id!)).rejects.toThrow(
      'Note with id',
    );
  });

  it('removes the note from the list', async () => {
    const noteA = await createNote.execute({
      title: 'Nota A',
      content: 'A',
    });
    await createNote.execute({ title: 'Nota B', content: 'B' });

    await deleteNote.execute(noteA.id!);

    const remaining = await listNotes.execute();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].toObject().title).toBe('Nota B');
  });

  it('throws NotFoundError when the note does not exist', async () => {
    await expect(deleteNote.execute('non-existent-id')).rejects.toThrow(
      'Note with id "non-existent-id" was not found',
    );
  });

  it('does not affect other notes when deleting one', async () => {
    const noteA = await createNote.execute({
      title: 'Nota A',
      content: 'A',
    });
    const noteB = await createNote.execute({
      title: 'Nota B',
      content: 'B',
    });

    await deleteNote.execute(noteA.id!);

    const stillThere = await getNote.execute(noteB.id!);
    expect(stillThere.toObject().title).toBe('Nota B');
  });
});