import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from '../../domain/author';
import { FilterAuthorDto, SortAuthorDto } from '../../dto/query-author.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: Model<Author>,
  ) {}

  async create(payload: Partial<Author>): Promise<Author> {
    const created = new this.authorModel(payload);
    return created.save();
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

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterAuthorDto | null;
    sortOptions?: SortAuthorDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Author[]> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filterOptions?.search) {
      query.$or = [
        { firstName: { $regex: filterOptions.search, $options: 'i' } },
        { lastName: { $regex: filterOptions.search, $options: 'i' } },
      ];
    }

    let sort: Record<string, 1 | -1> = {};
    if (sortOptions && sortOptions.length > 0) {
      sort = sortOptions.reduce((acc, { field, order }) => {
        acc[field] = order === 'ASC' ? 1 : -1;
        return acc;
      }, {});
    } else {
      sort = { createdAt: -1 };
    }

    return this.authorModel.find(query).sort(sort).skip(skip).limit(limit).exec();
  }

  async update(id: string, payload: Partial<Author>): Promise<Author | null> {
    return this.authorModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.authorModel.findByIdAndDelete(id).exec();
  }
}
