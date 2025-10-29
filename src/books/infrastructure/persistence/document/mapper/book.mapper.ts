import { Types } from 'mongoose';
import { Book } from 'src/books/domain/book';
import { BookSchemaClass } from '../entities/book.schema';

export class BookMapper {
  static toDomain(raw: BookSchemaClass): Book {
    const domainEntity = new Book();
    domainEntity.id = raw._id.toString();
    domainEntity.title = raw.title;
    domainEntity.isbn = raw.isbn;
    domainEntity.publishedDate = raw.publishedDate ?? null;
    domainEntity.genre = raw.genre ?? null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.authorId = raw.author?.toString() ?? null;

    return domainEntity;
  }

  // Convert domain entity to Mongoose document
  static toPersistence(domainEntity: Book): BookSchemaClass {
    const persistenceSchema = new BookSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.title = domainEntity.title ?? '';
    persistenceSchema.isbn = domainEntity.isbn ?? '';
    persistenceSchema.publishedDate = domainEntity.publishedDate ?? null;
    persistenceSchema.genre = domainEntity.genre ?? null;

    persistenceSchema.author = new Types.ObjectId(domainEntity.authorId);
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    return persistenceSchema;
  }
}
