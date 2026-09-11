import { runNoteRepositoryContract } from '../../tests/contracts/note-repository.contract.js';
import { InMemoryNoteRepository } from './in-memory-note-repository.js';

runNoteRepositoryContract('InMemoryNoteRepository', () => {
  return new InMemoryNoteRepository();
});