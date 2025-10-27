import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from '../../../../domain/author';
import { QueryAuthorDto } from '../../../../dto/query-author.dto';
import { AuthorSchemaClass } from '../entities/author.schema';
import { AuthorMapper } from '../mapper/authoer.mapper';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectModel(AuthorSchemaClass.name)
    private readonly authorModel: Model<AuthorSchemaClass>,
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

  async findByName(firstName: string, lastName: string): Promise<Author | null> {
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
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
      ];
    }

    // Default sorting by newest
    const sort: Record<string, 1 | -1> = { createdAt: -1 };

    const authorObjects = await this.authorModel.find(query).sort(sort).skip(skip).limit(limit).exec();

    return authorObjects.map((authorObject) => AuthorMapper.toDomain(authorObject));
  }

  async update(id: Author['id'], payload: Partial<Author>): Promise<Author | null> {
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
    await this.authorModel.findByIdAndDelete(id).exec();
  }
}
