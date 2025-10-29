import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { BooksService } from './book.service';
import { AuthorsService } from 'src/authors/author.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { Book } from './domain/book';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from 'src/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Books')
@Controller('v1/books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly authorsService: AuthorsService,
  ) {}

  /**
   * POST /books
   * Create a new book
   */
  @Post()
  @ApiCreatedResponse({ type: Book })
  @ApiBadRequestResponse({ description: 'Invalid authorId' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    // Ensure referenced author exists
    const author = await this.authorsService.findById(createBookDto.authorId);
    if (!author) {
      throw new BadRequestException(
        `Author with ID "${createBookDto.authorId}" does not exist.`,
      );
    }

    const createdBook = await this.booksService.create(createBookDto);
    return {
      ...createdBook,
      author,
    };
  }

  /**
   * GET /books
   * Get all books with pagination, search, and filtering
   */
  @ApiOkResponse({ type: InfinityPaginationResponse(Book) })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryBookDto,
  ): Promise<InfinityPaginationResponseDto<Book>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const books = await this.booksService.findManyWithPagination(query);
    return infinityPagination(books, { page, limit });
  }

  /**
   * GET /books/:id
   * Get a single book by ID
   */
  @Get(':id')
  @ApiOkResponse({ type: Book })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<Book> {
    const book = await this.booksService.findById(id);
    if (!book) throw new NotFoundException(`Book with ID "${id}" not found`);
    return book;
  }

  /**
   * PATCH /books/:id
   * Update an existing book
   */
  @Patch(':id')
  @ApiOkResponse({ type: Book })
  @ApiParam({ name: 'id', type: String })
  @ApiBadRequestResponse({ description: 'Invalid authorId' })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    // Validate authorId if present
    if (updateBookDto.authorId) {
      const author = await this.authorsService.findById(updateBookDto.authorId);
      if (!author) {
        throw new BadRequestException(
          `Author with ID "${updateBookDto.authorId}" does not exist.`,
        );
      }
    }

    const updated = await this.booksService.update(id, updateBookDto);
    if (!updated) throw new NotFoundException(`Book with ID "${id}" not found`);
    return updated;
  }

  /**
   * DELETE /books/:id
   * Delete a book by ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<void> {
    const book = await this.booksService.findById(id);
    if (!book) throw new NotFoundException(`Book with ID "${id}" not found`);
    await this.booksService.remove(id);
  }
}
