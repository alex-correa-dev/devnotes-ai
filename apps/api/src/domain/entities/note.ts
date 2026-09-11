export type NoteProps = {
  id: string | null;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export class Note {
  private constructor(private readonly props: NoteProps) {}

  static create(input: {
    title: string;
    content: string;
    tags?: string[];
  }): Note {
    Note.assertTitle(input.title);
    Note.assertContent(input.content);

    const now = new Date();

    return new Note({
      id: null, // MongoDB vai gerar depois
      title: input.title.trim(),
      content: input.content.trim(),
      tags: Note.normalizeTags(input.tags ?? []),
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: NoteProps): Note {
    return new Note(props);
  }

  withId(id: string): Note {
    return new Note({ ...this.props, id });
  }

  withUpdatedFields(input: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Note {
    if (input.title !== undefined) Note.assertTitle(input.title);
    if (input.content !== undefined) Note.assertContent(input.content);

    return new Note({
      ...this.props,
      title: input.title?.trim() ?? this.props.title,
      content: input.content?.trim() ?? this.props.content,
      tags: input.tags ? Note.normalizeTags(input.tags) : this.props.tags,
      updatedAt: new Date(),
    });
  }

  toObject(): NoteProps {
    return { ...this.props };
  }

  get id(): string | null {
    return this.props.id;
  }

  private static assertTitle(title: string): void {
    if (!title || title.trim().length < 3) {
      throw new Error('Note title must have at least 3 characters');
    }
  }

  private static assertContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error('Note content cannot be empty');
    }
  }

  private static normalizeTags(tags: string[]): string[] {
    return Array.from(
      new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
    );
  }
}