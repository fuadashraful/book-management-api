import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Book Management E2E', () => {
  let app: INestApplication;
  let authorId: string;
  let bookId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (bookId) {
      await request(app.getHttpServer())
        .delete(`/v1/books/${bookId}`)
        .expect(204);
    }

    if (authorId) {
      await request(app.getHttpServer())
        .delete(`/v1/authors/${authorId}`)
        .expect(204);
    }

    await app.close();
  });

  it('should create an author', async () => {
    const createAuthorDto = {
      firstName: 'J.K.',
      lastName: 'Rowling',
      bio: 'British author, best known for the Harry Potter series.',
      birthDate: '1965-07-31',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/authors')
      .send(createAuthorDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe(createAuthorDto.firstName);
    expect(response.body.lastName).toBe(createAuthorDto.lastName);

    authorId = response.body.id;
  });

  it('should create a book for the author', async () => {
    const createBookDto = {
      title: "Harry Potter and the Philosopher's Stone",
      isbn: '9780747532699',
      publishedDate: '1997-06-26T00:00:00.000Z',
      genre: 'Fantasy',
      authorId: authorId,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/books')
      .send(createBookDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(createBookDto.title);
    expect(response.body?.author?.id).toBe(authorId);

    bookId = response.body.id;
  });

  it('should get all books and include the created one', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/books')
      .expect(200);

    const books = response.body?.data;

    expect(Array.isArray(books)).toBe(true);

    const foundBook = books.find(
      (book: any) => book.title === "Harry Potter and the Philosopher's Stone",
    );

    expect(foundBook).toBeDefined();
    expect(foundBook?.author?.id).toBe(authorId);
  });
});
