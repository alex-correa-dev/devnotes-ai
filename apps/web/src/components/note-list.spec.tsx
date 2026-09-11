import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NoteList } from './note-list';

const makeNote = (id: string, title: string) => ({
  id,
  title,
  content: `Conteúdo de ${title}`,
  tags: [] as string[],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('NoteList', () => {
  it('renders the empty state when there are no notes', () => {
    render(<NoteList notes={[]} />);

    expect(screen.getByText('Nenhuma nota ainda. Que tal criar a primeira?')).toBeInTheDocument();
  });

  it('does not render a list when there are no notes', () => {
    render(<NoteList notes={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders one list item per note', () => {
    render(
      <NoteList
        notes={[
          makeNote('1', 'Primeira nota'),
          makeNote('2', 'Segunda nota'),
          makeNote('3', 'Terceira nota'),
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders the title of each note', () => {
    render(<NoteList notes={[makeNote('1', 'Primeira nota'), makeNote('2', 'Segunda nota')]} />);

    expect(screen.getByText('Primeira nota')).toBeInTheDocument();
    expect(screen.getByText('Segunda nota')).toBeInTheDocument();
  });

  it('does not render the empty state when there are notes', () => {
    render(<NoteList notes={[makeNote('1', 'Uma nota')]} />);

    expect(
      screen.queryByText('Nenhuma nota ainda. Que tal criar a primeira?'),
    ).not.toBeInTheDocument();
  });
});
