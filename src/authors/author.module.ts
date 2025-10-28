import { Module } from '@nestjs/common';
import { AuthorsController } from './author.controller';
import { AuthorsService } from './author.service';
import { DocumentAuthorPersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    DocumentAuthorPersistenceModule,
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService, DocumentAuthorPersistenceModule],
})
export class AuthorsModule {}