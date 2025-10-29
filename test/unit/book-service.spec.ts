import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../../src/books/book.service';
import { BookRepository } from '../../src/books/infrastructure/book-abstract.repository';
import { AuthorRepository } from '../../src/authors/infrastructure/persistence/author.repository';
import {
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Book } from '../../src/books/domain/book';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepo: Partial<Record<keyof BookRepository, jest.Mock>>;
  let authorRepo: Partial<Record<keyof AuthorRepository, jest.Mock>>;

  beforeEach(async () => {
    bookRepo = {
      findByIsbn: jest.fn(),
      create: jest.fn(),
      findManyWithPagination: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    authorRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BookRepository, useValue: bookRepo },
        { provide: AuthorRepository, useValue: authorRepo },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  describe('create', () => {
    it('should create a book if author exists and ISBN is unique', async () => {
      const dto = {
        title: 'Book 1',
        isbn: '12345',
        publishedDate: new Date(),
        genre: 'Fiction',
        authorId: 'author1',
      };
      authorRepo.findById.mockResolvedValue({
        id: 'author1',
        firstName: 'John',
        lastName: 'Doe',
      });
      bookRepo.findByIsbn.mockResolvedValue(null);
      bookRepo.create.mockResolvedValue({ id: 'book1', ...dto } as Book);

      const result = await service.create(dto);

      expect(authorRepo.findById).toHaveBeenCalledWith('author1');
      expect(bookRepo.findByIsbn).toHaveBeenCalledWith('12345');
      expect(bookRepo.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 'book1', ...dto });
    });

    it('should throw BadRequestException if author not found', async () => {
      authorRepo.findById.mockResolvedValue(null);
      const dto = {
        title: 'Book 1',
        isbn: '12345',
        publishedDate: new Date(),
        authorId: 'author1',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnprocessableEntityException if ISBN already exists', async () => {
      authorRepo.findById.mockResolvedValue({ id: 'author1' });
      bookRepo.findByIsbn.mockResolvedValue({ id: 'book1' } as Book);
      const dto = {
        title: 'Book 1',
        isbn: '12345',
        publishedDate: new Date(),
        authorId: 'author1',
      };

      await expect(service.create(dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findManyWithPagination', () => {
    it('should return books list', async () => {
      const books = [{ id: 'book1', title: 'Book 1' } as Book];
      bookRepo.findManyWithPagination.mockResolvedValue(books);

      const result = await service.findManyWithPagination({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(books);
      expect(bookRepo.findManyWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findById', () => {
    it('should return book if found', async () => {
      const book = { id: 'book1', title: 'Book 1' } as Book;
      bookRepo.findById.mockResolvedValue(book);

      const result = await service.findById('book1');

      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book not found', async () => {
      bookRepo.findById.mockResolvedValue(null);

      await expect(service.findById('book1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const existing = {
        id: 'book1',
        title: 'Old Title',
        isbn: '123',
        author: { id: 'author1' },
      } as Book;
      const dto = { title: 'New Title' };

      bookRepo.findById.mockResolvedValue(existing);
      bookRepo.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('book1', dto);

      expect(result.title).toBe('New Title');
      expect(bookRepo.update).toHaveBeenCalledWith(
        'book1',
        expect.objectContaining(dto),
      );
    });

    it('should throw NotFoundException if book not found', async () => {
      bookRepo.findById.mockResolvedValue(null);
      const dto = { title: 'New Title' };

      await expect(service.update('book1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if new authorId is invalid', async () => {
      const existing = {
        id: 'book1',
        title: 'Old Title',
        author: { id: 'author1' },
      } as Book;
      bookRepo.findById.mockResolvedValue(existing);
      authorRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('book1', { authorId: 'invalid-author' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an existing book', async () => {
      const existing = { id: 'book1', title: 'Book 1' } as Book;
      bookRepo.findById.mockResolvedValue(existing);
      bookRepo.remove.mockResolvedValue(undefined);

      await service.remove('book1');

      expect(bookRepo.remove).toHaveBeenCalledWith('book1');
    });

    it('should throw NotFoundException if book not found', async () => {
      bookRepo.findById.mockResolvedValue(null);

      await expect(service.remove('book1')).rejects.toThrow(NotFoundException);
    });
  });
});
