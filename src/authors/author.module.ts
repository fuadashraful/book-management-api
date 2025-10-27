import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsController } from './author.controller';
import { AuthorsService } from './author.service';
import { AuthorSchemaClass, AuthorSchema } from './infrastructure/persistence/document/entities/author.schema';
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