import { ApiProperty } from '@nestjs/swagger';

export class Author {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, example: 'Ashraful' })
  firstName: string | null;

  @ApiProperty({ type: String, example: 'Fuad' })
  lastName: string | null;

  @ApiProperty({ type: String, example: 'Biography of the author', required: false })
  bio?: string | null;

  @ApiProperty({ type: Date, required: false })
  birthDate?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date | null;
}
