import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Novel',
    description: 'Title of the book',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '978-3-16-148410-0',
    description: 'Unique ISBN number of the book',
  })
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty({
    example: '2025-01-15',
    description: 'Publication date of the book (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  publishedDate: string;

  @ApiProperty({
    example: 'Science Fiction',
    description: 'Genre of the book',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    description: 'Author ID of the book (must reference an existing author)',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string;
}
