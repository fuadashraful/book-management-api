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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiParam } from '@nestjs/swagger';
import { AuthorsService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorSchemaClass } from './infrastructure/persistence/document/entities/author.schema';
import { Author } from './domain/author';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResponse, InfinityPaginationResponseDto } from 'src/utils/dto/infinity-pagination-response.dto';
import { QueryAuthorDto } from './dto/query-author.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiCreatedResponse({ type: Author })
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }


  @ApiOkResponse({
    type: InfinityPaginationResponse(Author),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryAuthorDto,
  ): Promise<InfinityPaginationResponseDto<Author>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const authors = await this.authorsService.findManyWithPagination(query);

    return infinityPagination(authors, { page, limit });
  }


  @Get(':id')
  @ApiOkResponse({ type: Author })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<Author> {
    const author = await this.authorsService.findById(id);
    if (!author) throw new NotFoundException(`Author with ID "${id}" not found`);
    return author;
  }

  @Patch(':id')
  @ApiOkResponse({ type: Author })
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const updated = await this.authorsService.update(id, updateAuthorDto);
    if (!updated) throw new NotFoundException(`Author with ID "${id}" not found`);
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string): Promise<void> {
    return this.authorsService.remove(id);
  }
}
