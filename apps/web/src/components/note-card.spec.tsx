import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteCard } from './note-card';

const makeNote = (
  overrides: Partial<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: unknown;
    updatedAt: unknown;
  }> = {},
) => ({
  id: 'note-id',
  title: 'Título da nota',
  content: 'Conteúdo da nota',
  tags: [] as string[],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(<NoteCard note={makeNote({ title: 'Meu título' })} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Meu título');
  });

  it('renders the note content', () => {
    render(<NoteCard note={makeNote({ content: 'Meu conteúdo' })} />);

    expect(screen.getByText('Meu conteúdo')).toBeInTheDocument();
  });

  it('renders all tags', () => {
    render(<NoteCard note={makeNote({ tags: ['node', 'mongo', 'graphql'] })} />);

    expect(screen.getByText('node')).toBeInTheDocument();
    expect(screen.getByText('mongo')).toBeInTheDocument();
    expect(screen.getByText('graphql')).toBeInTheDocument();
  });

  it('renders no tag elements when tags is empty', () => {
    render(<NoteCard note={makeNote({ tags: [] })} />);

    expect(screen.queryByText('node')).not.toBeInTheDocument();
    expect(screen.queryByText('mongo')).not.toBeInTheDocument();
  });
});
