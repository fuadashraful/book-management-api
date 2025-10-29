import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { BookRepository } from './infrastructure/book-abstract.repository';
import { AuthorRepository } from '../authors/infrastructure/persistence/author.repository';
import { Book } from './domain/book';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BookRepository,
    private readonly authorsRepository: AuthorRepository,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const author = await this.authorsRepository.findById(
      createBookDto.authorId,
    );
    if (!author) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          authorId: 'authorNotFound',
        },
      });
    }

    const existingBook = await this.booksRepository.findByIsbn(
      createBookDto.isbn,
    );

    if (existingBook) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          isbn: 'isbnAlreadyExists',
        },
      });
    }

    return this.booksRepository.create({
      title: createBookDto.title,
      isbn: createBookDto.isbn,
      publishedDate: new Date(createBookDto.publishedDate) ?? null,
      genre: createBookDto.genre ?? null,
      authorId: createBookDto.authorId,
    });
  }

  async findManyWithPagination(queryDto: QueryBookDto): Promise<Book[]> {
    return this.booksRepository.findManyWithPagination(queryDto);
  }

  async findById(id: Book['id']): Promise<NullableType<Book>> {
    const book = await this.booksRepository.findById(id);
    if (!book) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'bookNotFound',
        },
      });
    }
    return book;
  }

  async update(
    id: Book['id'],
    updateBookDto: UpdateBookDto,
  ): Promise<Book | null> {
    const book = await this.booksRepository.findById(id);
    if (!book) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'bookNotFound',
        },
      });
    }

    // Validate authorId if updating
    if (updateBookDto.authorId) {
      const author = await this.authorsRepository.findById(
        updateBookDto.authorId,
      );
      if (!author) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: {
            authorId: 'authorNotFound',
          },
        });
      }
    }

    return this.booksRepository.update(id, {
      title: updateBookDto.title ?? book.title,
      isbn: updateBookDto.isbn ?? book.isbn,
      publishedDate: updateBookDto.publishedDate
        ? new Date(updateBookDto.publishedDate)
        : book.publishedDate,
      genre: updateBookDto.genre ?? book.genre,
      authorId: updateBookDto.authorId ?? book.author?.id,
    });
  }

  async remove(id: Book['id']): Promise<void> {
    const book = await this.booksRepository.findById(id);
    if (!book) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'bookNotFound',
        },
      });
    }

    await this.booksRepository.remove(id);
  }
}
