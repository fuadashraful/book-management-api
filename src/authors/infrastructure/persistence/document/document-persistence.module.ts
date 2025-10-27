import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorSchema, AuthorSchemaClass } from './entities/author.schema';
import { AuthorRepository } from '../author.repository';
import { AuthorDocumentRepository } from './repositories/author.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthorSchemaClass.name, schema: AuthorSchema },
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
