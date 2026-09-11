import { describe, it, expect, beforeEach } from 'vitest';
import { Note } from '../../domain/entities/note.js';
import type { NoteRepository } from '../../domain/repositories/note-repository.js';

type RepositoryFactory = () => NoteRepository;

export const runNoteRepositoryContract = (
  name: string,
  createRepository: RepositoryFactory,
): void => {
  describe(`NoteRepository contract — ${name}`, () => {
    let repository: NoteRepository;

    beforeEach(() => {
      repository = createRepository();
    });

    it('saves a note and retrieves it by id', async () => {
      const note = Note.create({ title: 'Contrato', content: 'Teste' });
      const id = await repository.save(note);

      const found = await repository.findById(id);
      expect(found).not.toBeNull();
      expect(found!.toObject().title).toBe('Contrato');
    });

    it('returns null when finding a non-existent id', async () => {
      const found = await repository.findById('does-not-exist');
      expect(found).toBeNull();
    });

    it('returns all saved notes', async () => {
      const noteA = Note.create({ title: 'Nota A', content: 'A' });
      const noteB = Note.create({ title: 'Nota B', content: 'B' });

      await repository.save(noteA);
      await repository.save(noteB);

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('deletes a note and returns true', async () => {
      const note = Note.create({ title: 'Deletar', content: 'X' });
      const id = await repository.save(note);

      const deleted = await repository.delete(id);
      expect(deleted).toBe(true);

      const found = await repository.findById(id);
      expect(found).toBeNull();
    });

    it('returns false when deleting a non-existent note', async () => {
      const deleted = await repository.delete('does-not-exist');
      expect(deleted).toBe(false);
    });

    it('updates an existing note on save', async () => {
      const note = Note.create({ title: 'Original', content: 'V1' });
      const id = await repository.save(note);

      const updated = note.withId(id).withUpdatedFields({
        title: 'Atualizado',
      });
      await repository.save(updated);

      const found = await repository.findById(id);
      expect(found!.toObject().title).toBe('Atualizado');
    });
  });
};