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
import { Author } from './infrastructure/persistence/document/entities/author.schema';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiCreatedResponse({ type: Author })
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }


  @Get()
  @ApiOkResponse({ type: [Author] })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
    limit = Math.min(limit, 50);
    return this.authorsService.findAll({ page, limit, search });
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
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.authorsService.remove(id);
    if (!deleted) throw new NotFoundException(`Author with ID "${id}" not found`);
  }
}
