import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../../src/authors/author.service';
import { AuthorRepository } from '../../src/authors/infrastructure/persistence/author.repository';
import { Author } from '../../src/authors/domain/author';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: Partial<Record<keyof AuthorRepository, jest.Mock>>;

  beforeEach(async () => {
    repository = {
      findByName: jest.fn(),
      create: jest.fn(),
      findManyWithPagination: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: AuthorRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Bio',
        birthDate: new Date(),
      };
      repository.findByName.mockResolvedValue(null);
      repository.create.mockResolvedValue({ id: '1', ...dto } as Author);

      const result = await service.create(dto);

      expect(repository.findByName).toHaveBeenCalledWith('John', 'Doe');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: '1', ...dto });
    });

    it('should throw UnprocessableEntityException if author exists', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Bio',
        birthDate: new Date(),
      };
      repository.findByName.mockResolvedValue({ id: '1', ...dto } as Author);

      await expect(service.create(dto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findManyWithPagination', () => {
    it('should return authors list', async () => {
      const authors = [
        { id: '1', firstName: 'John', lastName: 'Doe' } as Author,
      ];
      repository.findManyWithPagination.mockResolvedValue(authors);

      const result = await service.findManyWithPagination({
        page: 1,
        limit: 10,
      });

      expect(result).toEqual(authors);
      expect(repository.findManyWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findById', () => {
    it('should return author if found', async () => {
      const author = { id: '1', firstName: 'John', lastName: 'Doe' } as Author;
      repository.findById.mockResolvedValue(author);

      const result = await service.findById('1');

      expect(result).toEqual(author);
    });

    it('should throw NotFoundException if author not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an existing author', async () => {
      const existing = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        bio: '',
        birthDate: new Date(),
      } as Author;
      repository.findById.mockResolvedValue(existing);
      const dto = { firstName: 'Jane' };
      repository.update.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);

      expect(result.firstName).toBe('Jane');
      expect(repository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining(dto),
      );
    });

    it('should throw NotFoundException if author not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('1', { firstName: 'Jane' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing author', async () => {
      const existing = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
      } as Author;
      repository.findById.mockResolvedValue(existing);
      repository.remove.mockResolvedValue(undefined);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if author not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
