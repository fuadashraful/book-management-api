import { ApiProperty } from '@nestjs/swagger';
import { Author } from 'src/authors/domain/author';

export class Book {
  @ApiProperty({ type: String, description: 'Unique identifier for the book' })
  id: string;

  @ApiProperty({ type: String, example: 'The Art of Coding', description: 'Title of the book' })
  title: string;

  @ApiProperty({
    type: String,
    example: '978-3-16-148410-0',
    description: 'Unique ISBN number of the book',
  })
  isbn: string;

  @ApiProperty({
    type: Date,
    required: false,
    example: '2023-05-15',
    description: 'Publication date of the book',
  })
  publishedDate: Date | null;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Science Fiction',
    description: 'Genre of the book',
  })
  genre?: string | null;

  @ApiProperty({
    type: () => Author,
    description: 'Author of the book',
  })
  author?: Author;

  @ApiProperty({
    type: String,
    example: '653b4e9a2f4e8a001234abcd',
    description: 'ID of the author of the book',
  })
  authorId: string;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the book record was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the book record was last updated',
  })
  updatedAt: Date;
}
