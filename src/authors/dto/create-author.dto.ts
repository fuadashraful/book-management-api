import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Ashraful', type: String })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Islam', type: String })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    example: 'John Doe is a novelist and essayist.',
    type: String,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    example: '1980-05-21',
    description: 'Author birth date in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  birthDate?: Date;
}
