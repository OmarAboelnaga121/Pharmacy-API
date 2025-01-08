import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum'
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';

const correctAdminData = {
  "name": "John Doe",
  "phoneNumber": "123-456-7890",
  "address": "1234 Elm Street",
  "email": 'omaraboelnaga121@gmail.com',
  "password": "StrongP@ssw0rd!",
  "role": Role.ADMIN
}

describe('AppController (e2e)', () => {
  let app : INestApplication;
  let prisma : PrismaService;
  
  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(3453);

    pactum.request.setBaseUrl(`http://localhost:3453`);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();   
  });

  describe('register and login user', () => {
    it('Register /auth/register missed name Status:400', async () => {
      await pactum.spec()
        .post('/auth/register')
        .withJson({
          "phoneNumber": "123-456-7890",
          "address": "1234 Elm Street",
          "email": 'omaraboelnaga121@gmail.com',
          "password": "StrongP@ssw0rd!",
          "role": Role.ADMIN
        })
        .expectStatus(400)
    })
    it('Register /auth/register missed password Status:400', async () => {
      await pactum.spec()
        .post('/auth/register')
        .withJson({
          "name": "John Doe",
          "phoneNumber": "123-456-7890",
          "address": "1234 Elm Street",
          "email": 'omaraboelnaga121@gmail.com',
          "role": Role.ADMIN
        })
        .expectStatus(400)
    })

    it('Register /auth/register missed password Status:400', async () => {
      await pactum.spec()
        .post('/auth/register')
        .withJson({
          "name": "John Doe",
          "phoneNumber": "123-456-7890",
          "address": "1234 Elm Street",
          "email": 'omaraboelnaga121@gmail.com',
          "password": "weakpassword",
          "role": Role.ADMIN
        })
        .expectStatus(400)
    })

    it('Register /auth/register success Status:201', async () => {
      await pactum.spec()
        .post('/auth/register')
        .withJson(correctAdminData)
        .expectStatus(201)
    })
    it('Register /auth/register duplicate email Status:400', async () => {
      await pactum.spec()
        .post('/auth/register')
        .withJson(correctAdminData)
        .expectStatus(400)
    })

  })

  // it('GET', () => {
  //   it('GET /users', async () => {})
  // });
  // it('POST', () => {})
});
