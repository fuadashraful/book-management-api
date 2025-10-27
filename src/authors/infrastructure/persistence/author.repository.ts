import { NullableType } from '../../../utils/types/nullable.type';
import { Author } from 'src/authors/domain/author';
import { QueryAuthorDto } from 'src/authors/dto/query-author.dto';

export abstract class AuthorRepository {
  abstract create(
    data: Partial<Author>,
  ): Promise<Author>;

  abstract findManyWithPagination(queryDto: QueryAuthorDto): Promise<Author[]>;

  abstract findById(id: Author['id']): Promise<NullableType<Author>>;

  abstract findByName(firstName: string, lastName: string): Promise<Author | null>;

  abstract update(id: Author['id'], payload: Partial<Author>): Promise<Author | null>;

  abstract remove(id: Author['id']): Promise<void>;
}
