import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorSchema, AuthorSchemaClass } from './entities/author.schema';
import {
  BookSchemaClass,
  BookSchema,
} from 'src/books/infrastructure/persistence/document/entities/book.schema';
import { AuthorRepository } from '../author.repository';
import { AuthorDocumentRepository } from './repositories/author.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthorSchemaClass.name, schema: AuthorSchema },
      { name: BookSchemaClass.name, schema: BookSchema },
    ]),
  ],
  providers: [
    {
      provide: AuthorRepository,
      useClass: AuthorDocumentRepository,
    },
  ],
  exports: [AuthorRepository],
})
export class DocumentAuthorPersistenceModule {}
