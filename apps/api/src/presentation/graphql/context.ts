import type {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
  SearchNotesUseCase,
  AutocompleteNotesUseCase,
} from '../../../application/use-cases/index.js';

export type GraphQLContext = {
  useCases: {
    createNote: CreateNoteUseCase;
    listNotes: ListNotesUseCase;
    getNote: GetNoteUseCase;
    updateNote: UpdateNoteUseCase;
    deleteNote: DeleteNoteUseCase;
    searchNotes: SearchNotesUseCase;
    autocompleteNotes: AutocompleteNotesUseCase;
  };
};