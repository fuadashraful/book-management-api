import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema, BookSchemaClass } from './entities/book.schema';
import { BookRepository } from '../../book-abstract.repository';
import { BookDocumentRepository } from './repositories/book.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookSchemaClass.name, schema: BookSchema },
    ]),
  ],
  providers: [
    {
      provide: BookRepository,
      useClass: BookDocumentRepository,
    },
  ],
  exports: [BookRepository],
})
export class DocumentBookPersistenceModule {}
