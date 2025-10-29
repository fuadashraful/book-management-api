import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../../../../domain/book';
import { QueryBookDto } from '../../../../dto/query-book.dto';
import { BookSchemaClass } from '../entities/book.schema';
import { BookMapper } from '../mapper/book.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { BookRepository } from 'src/books/infrastructure/book-abstract.repository';

@Injectable()
export class BookDocumentRepository implements BookRepository {
  constructor(
    @InjectModel(BookSchemaClass.name)
    private readonly bookModel: Model<BookSchemaClass>,
  ) {}

  async create(payload: Partial<Book>): Promise<Book> {
    const persistenceModel = BookMapper.toPersistence(payload as Book);
    const createdBook = new this.bookModel(persistenceModel);
    const bookObject = await createdBook.save();
    return BookMapper.toDomain(bookObject);
  }

  async findById(id: Book['id']): Promise<NullableType<Book>> {
    const bookObject = await this.bookModel
      .findById(id)
      .populate('author')
      .exec();
    return bookObject ? BookMapper.toDomain(bookObject) : null;
  }

  async findByIsbn(isbn: string): Promise<NullableType<Book>> {
    const bookObject = await this.bookModel.findOne({ isbn }).exec();
    return bookObject ? BookMapper.toDomain(bookObject) : null;
  }

  async findManyWithPagination(queryDto: QueryBookDto): Promise<Book[]> {
    const { title, isbn, authorId, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (isbn) {
      query.isbn = { $regex: isbn, $options: 'i' };
    }
    if (authorId) {
      query.authorId = authorId;
    }

    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const bookObjects = await this.bookModel
      .find(query)
      .populate('author')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return bookObjects.map((bookObject) => BookMapper.toDomain(bookObject));
  }

  async update(id: Book['id'], payload: Partial<Book>): Promise<Book | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };

    const book = await this.bookModel.findOne(filter);
    if (!book) return null;

    const updatedBook = await this.bookModel
      .findOneAndUpdate(
        filter,
        BookMapper.toPersistence({
          ...BookMapper.toDomain(book),
          ...clonedPayload,
        }),
        { new: true },
      )
      .populate('author');

    return updatedBook ? BookMapper.toDomain(updatedBook) : null;
  }

  async remove(id: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(id).exec();
  }
}
