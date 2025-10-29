import { Module } from '@nestjs/common';
import { BooksController } from './book.controller';
import { BooksService } from './book.service';
import { DocumentBookPersistenceModule } from './infrastructure/persistence/document/document-book-persistence.module';
import { AuthorsModule } from 'src/authors/author.module';

@Module({
  imports: [
    // import modules, etc.
    DocumentBookPersistenceModule,
    AuthorsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, DocumentBookPersistenceModule],
})
export class BooksModule {}
