import type {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
} from '../../../application/use-cases/index.js';

export type GraphQLContext = {
  useCases: {
    createNote: CreateNoteUseCase;
    listNotes: ListNotesUseCase;
    getNote: GetNoteUseCase;
    updateNote: UpdateNoteUseCase;
    deleteNote: DeleteNoteUseCase;
  };
};