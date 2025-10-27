import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from '../../../../domain/author';
import { QueryAuthorDto } from '../../../../dto/query-author.dto';
import { AuthorSchemaClass } from '../entities/author.schema';
import { AuthorMapper } from '../mapper/authoer.mapper';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectModel(AuthorSchemaClass.name)
    private readonly authorModel: Model<AuthorSchemaClass>,
  ) {}

  async create(payload: Partial<Author>): Promise<Author> {
    const persistenceModel = AuthorMapper.toPersistence(payload);
    const createdAuthor = new this.authorModel(persistenceModel);
    const authorObject = await createdAuthor.save();
    return AuthorMapper.toDomain(authorObject);
  }

  async findById(id: string): Promise<Author | null> {
    return this.authorModel.findById(id).exec();
  }

  async findByName(firstName: string, lastName: string): Promise<Author | null> {
    return this.authorModel.findOne({
      firstName: { $regex: `^${firstName}$`, $options: 'i' },
      lastName: { $regex: `^${lastName}$`, $options: 'i' },
    }).exec();
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

    return this.authorModel.find(query).sort(sort).skip(skip).limit(limit).exec();
  }

  async update(id: string, payload: Partial<Author>): Promise<Author | null> {
    return this.authorModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.authorModel.findByIdAndDelete(id).exec();
  }
}
