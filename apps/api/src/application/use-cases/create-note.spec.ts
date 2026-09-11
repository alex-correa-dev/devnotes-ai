import { describe, it, expect, beforeEach } from 'vitest';
import { CreateNoteUseCase } from './create-note.js';
import { InMemoryNoteRepository } from '../../infra/repositories/in-memory-note-repository.js';

describe('CreateNoteUseCase', () => {
  let repository: InMemoryNoteRepository;
  let useCase: CreateNoteUseCase;

  beforeEach(() => {
    repository = new InMemoryNoteRepository();
    useCase = new CreateNoteUseCase(repository);
  });

  it('creates a note with the given title and content', async () => {
    const note = await useCase.execute({
      title: 'Estudando Vitest',
      content: 'Escrevendo testes unitários.',
    });

    expect(note.id).toBeDefined();
    expect(note.toObject().title).toBe('Estudando Vitest');
    expect(note.toObject().content).toBe('Escrevendo testes unitários.');
  });

  it('normalizes tags to lowercase and removes duplicates', async () => {
    const note = await useCase.execute({
      title: 'Nota com tags',
      content: 'Conteúdo',
      tags: ['Node', 'node', 'GRAPHQL'],
    });

    expect(note.toObject().tags).toEqual(['node', 'graphql']);
  });

  it('persists the note in the repository', async () => {
    const note = await useCase.execute({
      title: 'Nota persistida',
      content: 'Conteúdo',
    });

    const found = await repository.findById(note.id!);
    expect(found).not.toBeNull();
    expect(found!.toObject().title).toBe('Nota persistida');
  });

  it('rejects a title shorter than 3 characters', async () => {
    await expect(
      useCase.execute({ title: 'ab', content: 'Conteúdo' }),
    ).rejects.toThrow('Note title must have at least 3 characters');
  });

  it('rejects empty content', async () => {
    await expect(
      useCase.execute({ title: 'Título válido', content: '' }),
    ).rejects.toThrow('Note content cannot be empty');
  });
});