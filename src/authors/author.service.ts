import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { NullableType } from '../utils/types/nullable.type';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';
import { AuthorRepository } from './infrastructure/persistence/author.repository';
import { Author } from './domain/author';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorRepository) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    // Optional: prevent duplicate author (same firstName + lastName)
    const existing = await this.authorsRepository.findByName(
      createAuthorDto.firstName,
      createAuthorDto.lastName,
    );

    if (existing) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          name: 'authorAlreadyExists',
        },
      });
    }

    return this.authorsRepository.create({
      firstName: createAuthorDto.firstName,
      lastName: createAuthorDto.lastName,
      bio: createAuthorDto.bio,
      birthDate: createAuthorDto.birthDate,
    });
  }

  async findManyWithPagination(queryDto: QueryAuthorDto): Promise<Author[]> {
    return this.authorsRepository.findManyWithPagination(queryDto);
  }

  async findById(id: Author['id']): Promise<NullableType<Author>> {
    const author = await this.authorsRepository.findById(id);
    if (!author) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'authorNotFound',
        },
      });
    }
    return author;
  }

  async update(
    id: Author['id'],
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author | null> {
    const author = await this.authorsRepository.findById(id);
    if (!author) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'authorNotFound',
        },
      });
    }

    return this.authorsRepository.update(id, {
      firstName: updateAuthorDto.firstName ?? author.firstName,
      lastName: updateAuthorDto.lastName ?? author.lastName,
      bio: updateAuthorDto.bio ?? author.bio,
      birthDate: updateAuthorDto.birthDate ?? author.birthDate,
    });
  }

  async remove(id: Author['id']): Promise<void> {
    const author = await this.authorsRepository.findById(id);
    if (!author) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'authorNotFound',
        },
      });
    }

    await this.authorsRepository.remove(id);
  }
}
