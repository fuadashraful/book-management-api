import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Author } from '../../../../domain/author';
import { QueryAuthorDto } from '../../../../dto/query-author.dto';
import { AuthorSchemaClass } from '../entities/author.schema';
import { BookSchemaClass } from 'src/books/infrastructure/persistence/document/entities/book.schema';
import { AuthorMapper } from '../mapper/authoer.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthorRepository } from '../../author.repository';

@Injectable()
export class AuthorDocumentRepository implements AuthorRepository {
  constructor(
    @InjectModel(AuthorSchemaClass.name)
    private readonly authorModel: Model<AuthorSchemaClass>,
    @InjectModel(BookSchemaClass.name)
    private readonly bookModel: Model<BookSchemaClass>,
  ) {}

  async create(payload: Partial<Author>): Promise<Author> {
    const persistenceModel = AuthorMapper.toPersistence(payload as Author);
    const createdAuthor = new this.authorModel(persistenceModel);
    const authorObject = await createdAuthor.save();
    return AuthorMapper.toDomain(authorObject);
  }

  async findById(id: Author['id']): Promise<NullableType<Author>> {
    const userObject = await this.authorModel.findById(id);
    return userObject ? AuthorMapper.toDomain(userObject) : null;
  }

  async findByName(
    firstName: string,
    lastName: string,
  ): Promise<Author | null> {
    const authorObj = await this.authorModel.findOne({
      firstName: { $regex: `^${firstName}$`, $options: 'i' },
      lastName: { $regex: `^${lastName}$`, $options: 'i' },
    });

    return authorObj ? AuthorMapper.toDomain(authorObj) : null;
  }

  async findManyWithPagination(queryDto: QueryAuthorDto): Promise<Author[]> {
    const { firstName, lastName, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Combine firstName and lastName for partial match search
    if (firstName || lastName) {
      const searchRegex = new RegExp(
        `${firstName ?? ''}${lastName ? ' ' + lastName : ''}`,
        'i',
      );
      query.$or = [{ firstName: searchRegex }, { lastName: searchRegex }];
    }

    // Default sorting by newest
    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const authorObjects = await this.authorModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    return authorObjects.map((authorObject) =>
      AuthorMapper.toDomain(authorObject),
    );
  }

  async update(
    id: Author['id'],
    payload: Partial<Author>,
  ): Promise<Author | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };

    const author = await this.authorModel.findOne(filter);

    if (!author) {
      return null;
    }

    const authorObject = await this.authorModel.findOneAndUpdate(
      filter,
      AuthorMapper.toPersistence({
        ...AuthorMapper.toDomain(author),
        ...clonedPayload,
      }),
      { new: true },
    );

    return authorObject ? AuthorMapper.toDomain(authorObject) : null;
  }

  async remove(id: string): Promise<void> {
    const bookExists = await this.bookModel.exists({
      author: new Types.ObjectId(id),
    });

    if (bookExists) {
      throw new BadRequestException(
        'Cannot delete author: there are books associated with this author',
      );
    }

    const result = await this.authorModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }
}
