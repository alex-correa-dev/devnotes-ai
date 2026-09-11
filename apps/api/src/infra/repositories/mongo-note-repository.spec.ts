import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoNoteRepository } from './mongo-note-repository.js';
import { NoteModel } from '../database/mongoose/models/note-model.js';
import { Note } from '../../domain/entities/note.js';

/**
 * Integration tests for MongoNoteRepository using an in-memory MongoDB.
 *
 * Note: mongodb-memory-server does not include the `mongot` sidecar, so the
 * full-text search methods (search, autocomplete, searchWithFacets) cannot be
 * exercised here. Those are covered by the contract test against the real
 * `mongodb-atlas-local` image during end-to-end runs. This file focuses on
 * CRUD, which is what the repository shares with the in-memory adapter.
 */
describe('MongoNoteRepository', () => {
  let mongod: MongoMemoryServer;
  let repository: MongoNoteRepository;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    repository = new MongoNoteRepository();
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await NoteModel.deleteMany({});
  });

  describe('save', () => {
    it('persists a new note and returns its id', async () => {
      const note = Note.create({ title: 'Nova nota', content: 'Conteúdo' });

      const id = await repository.save(note);

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');

      const found = await repository.findById(id);
      expect(found).not.toBeNull();
      expect(found!.toObject().title).toBe('Nova nota');
    });

    it('updates an existing note when called with the same id', async () => {
      const note = Note.create({ title: 'Original', content: 'V1' });
      const id = await repository.save(note);

      const updated = note.withId(id).withUpdatedFields({ title: 'Atualizado' });
      await repository.save(updated);

      const found = await repository.findById(id);
      expect(found!.toObject().title).toBe('Atualizado');

      const count = await NoteModel.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('findById', () => {
    it('returns null when the note does not exist', async () => {
      const found = await repository.findById('000000000000000000000000');
      expect(found).toBeNull();
    });

    it('returns the note with all properties intact', async () => {
      const note = Note.create({
        title: 'Nota completa',
        content: 'Conteúdo completo',
        tags: ['node', 'mongo'],
      });
      const id = await repository.save(note);

      const found = await repository.findById(id);
      const obj = found!.toObject();

      expect(obj.id).toBe(id);
      expect(obj.title).toBe('Nota completa');
      expect(obj.content).toBe('Conteúdo completo');
      expect(obj.tags).toEqual(['node', 'mongo']);
      expect(obj.createdAt).toBeInstanceOf(Date);
      expect(obj.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findAll', () => {
    it('returns an empty array when there are no notes', async () => {
      const all = await repository.findAll();
      expect(all).toEqual([]);
    });

    it('returns all persisted notes', async () => {
      await repository.save(Note.create({ title: 'Nota A', content: 'A' }));
      await repository.save(Note.create({ title: 'Nota B', content: 'B' }));
      await repository.save(Note.create({ title: 'Nota C', content: 'C' }));

      const all = await repository.findAll();

      expect(all).toHaveLength(3);
      expect(all.map((n) => n.toObject().title).sort()).toEqual(['Nota A', 'Nota B', 'Nota C']);
    });
  });

  describe('delete', () => {
    it('removes the note and returns true', async () => {
      const note = Note.create({ title: 'Para deletar', content: 'X' });
      const id = await repository.save(note);

      const result = await repository.delete(id);

      expect(result).toBe(true);
      expect(await repository.findById(id)).toBeNull();
    });

    it('returns false when the note does not exist', async () => {
      const result = await repository.delete('000000000000000000000000');
      expect(result).toBe(false);
    });

    it('does not affect other notes', async () => {
      const noteA = Note.create({ title: 'Nota A', content: 'A' });
      const noteB = Note.create({ title: 'Nota B', content: 'B' });

      const idA = await repository.save(noteA);
      const idB = await repository.save(noteB);

      await repository.delete(idA);

      const stillThere = await repository.findById(idB);
      expect(stillThere).not.toBeNull();
      expect(stillThere!.toObject().title).toBe('Nota B');
    });
  });
});
