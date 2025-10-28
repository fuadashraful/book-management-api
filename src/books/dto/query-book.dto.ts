import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class QueryBookDto {
  @ApiPropertyOptional({
    example: 'The Art of Coding',
    description: 'Search by book title (partial, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: '978-3-16-148410-0',
    description: 'Search by ISBN (partial, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    example: 'c2f5e9e3-6b7b-4dcb-8f8f-123456789abc',
    description: 'Filter books by author ID',
  })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page (max: 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
