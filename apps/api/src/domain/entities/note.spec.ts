import { describe, it, expect } from 'vitest';
import { Note } from './note.js';

describe('Note', () => {
  describe('create', () => {
    it('creates a note with a null id until persisted', () => {
      const note = Note.create({ title: 'Título', content: 'Conteúdo' });

      expect(note.id).toBeNull();
    });

    it('trims title and content', () => {
      const note = Note.create({
        title: '  Título com espaços  ',
        content: '  Conteúdo com espaços  ',
      });

      const obj = note.toObject();
      expect(obj.title).toBe('Título com espaços');
      expect(obj.content).toBe('Conteúdo com espaços');
    });

    it('normalizes tags to lowercase and removes duplicates', () => {
      const note = Note.create({
        title: 'Nota',
        content: 'Conteúdo',
        tags: ['Node', 'node', 'GRAPHQL', 'GraphQL'],
      });

      expect(note.toObject().tags).toEqual(['node', 'graphql']);
    });

    it('removes empty tags after trimming', () => {
      const note = Note.create({
        title: 'Nota',
        content: 'Conteúdo',
        tags: ['node', '', '  ', 'graphql'],
      });

      expect(note.toObject().tags).toEqual(['node', 'graphql']);
    });

    it('defaults tags to an empty array when not provided', () => {
      const note = Note.create({ title: 'Nota', content: 'Conteúdo' });

      expect(note.toObject().tags).toEqual([]);
    });

    it('sets createdAt and updatedAt to the same instant', () => {
      const note = Note.create({ title: 'Nota', content: 'Conteúdo' });

      const { createdAt, updatedAt } = note.toObject();
      expect(createdAt.getTime()).toBe(updatedAt.getTime());
    });

    it('rejects a title shorter than 3 characters', () => {
      expect(() => Note.create({ title: 'ab', content: 'Conteúdo' })).toThrow(
        'Note title must have at least 3 characters',
      );
    });

    it('rejects an empty title', () => {
      expect(() => Note.create({ title: '', content: 'Conteúdo' })).toThrow(
        'Note title must have at least 3 characters',
      );
    });

    it('rejects a title made only of whitespace', () => {
      expect(() => Note.create({ title: '   ', content: 'Conteúdo' })).toThrow(
        'Note title must have at least 3 characters',
      );
    });

    it('rejects empty content', () => {
      expect(() => Note.create({ title: 'Título válido', content: '' })).toThrow(
        'Note content cannot be empty',
      );
    });

    it('rejects content made only of whitespace', () => {
      expect(() => Note.create({ title: 'Título válido', content: '   ' })).toThrow(
        'Note content cannot be empty',
      );
    });
  });

  describe('restore', () => {
    it('reconstructs a note from persisted props without revalidating', () => {
      const props = {
        id: 'existing-id',
        title: 'Título persistido',
        content: 'Conteúdo persistido',
        tags: ['node'],
        createdAt: new Date('2026-01-01T00:00:00Z'),
        updatedAt: new Date('2026-01-02T00:00:00Z'),
      };

      const note = Note.restore(props);

      expect(note.id).toBe('existing-id');
      expect(note.toObject()).toEqual(props);
    });

    it('accepts a persisted note with a short title', () => {
      // restore skips validation because the data was already validated
      // at creation time; it must not reject legacy rows.
      const note = Note.restore({
        id: 'legacy-id',
        title: 'ab',
        content: 'Conteúdo',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(note.toObject().title).toBe('ab');
    });
  });

  describe('withId', () => {
    it('returns a new note with the given id', () => {
      const note = Note.create({ title: 'Nota', content: 'Conteúdo' });

      const withId = note.withId('new-id');

      expect(withId.id).toBe('new-id');
      expect(note.id).toBeNull();
    });

    it('preserves every other property', () => {
      const note = Note.create({
        title: 'Nota',
        content: 'Conteúdo',
        tags: ['node'],
      });

      const withId = note.withId('new-id');

      expect(withId.toObject().title).toBe('Nota');
      expect(withId.toObject().tags).toEqual(['node']);
    });
  });

  describe('withUpdatedFields', () => {
    it('updates only the title when content is omitted', () => {
      const note = Note.create({ title: 'Antes', content: 'Conteúdo' });

      const updated = note.withUpdatedFields({ title: 'Depois' });

      expect(updated.toObject().title).toBe('Depois');
      expect(updated.toObject().content).toBe('Conteúdo');
    });

    it('updates only the content when title is omitted', () => {
      const note = Note.create({ title: 'Título', content: 'Antes' });

      const updated = note.withUpdatedFields({ content: 'Depois' });

      expect(updated.toObject().content).toBe('Depois');
      expect(updated.toObject().title).toBe('Título');
    });

    it('replaces tags when provided and normalizes them', () => {
      const note = Note.create({
        title: 'Nota',
        content: 'Conteúdo',
        tags: ['old'],
      });

      const updated = note.withUpdatedFields({ tags: ['Node', 'NODE'] });

      expect(updated.toObject().tags).toEqual(['node']);
    });

    it('keeps the original tags when tags are omitted', () => {
      const note = Note.create({
        title: 'Nota',
        content: 'Conteúdo',
        tags: ['node', 'mongo'],
      });

      const updated = note.withUpdatedFields({ title: 'Novo título' });

      expect(updated.toObject().tags).toEqual(['node', 'mongo']);
    });

    it('advances updatedAt without changing createdAt', () => {
      const note = Note.create({ title: 'Nota', content: 'Conteúdo' });
      const createdAt = note.toObject().createdAt;

      const updated = note.withUpdatedFields({ title: 'Novo título' });

      expect(updated.toObject().createdAt.getTime()).toBe(createdAt.getTime());
      expect(updated.toObject().updatedAt.getTime()).toBeGreaterThanOrEqual(createdAt.getTime());
    });

    it('rejects an invalid title', () => {
      const note = Note.create({ title: 'Válido', content: 'Conteúdo' });

      expect(() => note.withUpdatedFields({ title: 'ab' })).toThrow(
        'Note title must have at least 3 characters',
      );
    });

    it('rejects empty content', () => {
      const note = Note.create({ title: 'Válido', content: 'Conteúdo' });

      expect(() => note.withUpdatedFields({ content: '' })).toThrow('Note content cannot be empty');
    });
  });
});
