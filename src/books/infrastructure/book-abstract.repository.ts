import { NullableType } from 'src/utils/types/nullable.type';
import { Book } from 'src/books/domain/book';
import { QueryBookDto } from 'src/books/dto/query-book.dto';

export abstract class BookRepository {
  abstract create(
    data: Partial<Book>,
  ): Promise<Book>;

  abstract findManyWithPagination(queryDto: QueryBookDto): Promise<Book[]>;

  abstract findById(id: Book['id']): Promise<NullableType<Book>>;

  abstract findByTitle(title: string): Promise<Book | null>;

  abstract update(id: Book['id'], payload: Partial<Book>): Promise<Book | null>;

  abstract remove(id: Book['id']): Promise<void>;
}
