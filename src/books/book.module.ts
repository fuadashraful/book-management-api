import { Module } from '@nestjs/common';
import { BooksController } from './book.controller';
import { BooksService } from './book.service';
import { DocumentBookPersistenceModule } from './infrastructure/persistence/document/document-book-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    DocumentBookPersistenceModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, DocumentBookPersistenceModule],
})
export class BooksModule {}
