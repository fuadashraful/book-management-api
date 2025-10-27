import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorsController } from './author.controller';
import { AuthorsService } from './author.service';
import { AuthorSchemaClass, AuthorSchema } from './infrastructure/persistence/document/entities/author.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthorSchemaClass.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
