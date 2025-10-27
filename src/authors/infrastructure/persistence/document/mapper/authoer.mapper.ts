import { Author } from 'src/authors/domain/author';
import { AuthorSchemaClass } from '../entities/author.schema';

export class AuthorMapper {
  // Convert Mongoose document to domain entity
  static toDomain(raw: AuthorSchemaClass): Author {
    const domainEntity = new Author();
    domainEntity.id = raw._id.toString();
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.bio = raw.bio ?? null;
    domainEntity.birthDate = raw.birthDate ?? null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  // Convert domain entity to Mongoose document
  static toPersistence(domainEntity: Author): AuthorSchemaClass {
    const persistenceSchema = new AuthorSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.firstName = domainEntity.firstName ?? '';
    persistenceSchema.lastName = domainEntity.lastName ?? '';
    persistenceSchema.bio = domainEntity.bio ?? null;
    persistenceSchema.birthDate = domainEntity.birthDate ?? null;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    return persistenceSchema;
  }
}
