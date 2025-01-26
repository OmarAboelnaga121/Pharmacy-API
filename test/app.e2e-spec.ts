import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum'
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';


const correctAdminData = {
  "name": "John Doe",
  "phoneNumber": "123-456-7890",
  "address": "1234 Elm Street",
  "email": 'omaraboelnaga121@gmail.com',
  "password": "StrongP@ssw0rd!",
  "role": Role.ADMIN
}

const MedicineData = {
  "medicinieName": "Panadol Extra",
  "Description": "For Back Pain",
  "price": 100,
  "stock": 500
}


describe('AppController (e2e)', () => {
  let app : INestApplication;
  let prisma : PrismaService;
  let authToken: string; 
  let testUserId: string;
  let testMedicineId : string
  let testMedicineIdForOrder : string
  let testOrderId : string



  jest.setTimeout(30000);
  
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
    const testUser = await pactum.spec()
      .post('/auth/register')
      .withJson({
        "name": "Test Delete User",
        "phoneNumber": "111-222-3333",
        "address": "Test Address",
        "email": "testdelete@test.com",
        "password": "StrongP@ssw0rd!",
        "role": Role.CUSTOMER
      })
      .expectStatus(201)
      .stores('userId', 'user.id') 
      .returns('user.id');         
  
    testUserId = testUser;
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
    it('Login /auth/login success Status:200', async () => {
      await pactum.spec()
        .post('/auth/login')
        .withJson(correctAdminData)
        .expectStatus(201)
        .stores('authToken', 'token.access_token')
    })
    it('Login /auth/login wrong email Status:400', async () => {
      await pactum.spec()
        .post('/auth/login')
        .withJson({
          "email": '',
          "password": "StrongP@ssw0rd!",
        })
        .expectStatus(400)
    })
    it('Login /auth/login wrong password Status:400', async () => {
      await pactum.spec()
        .post('/auth/login')
        .withJson({
          "email": 'omaraboelnaga121@gmail.com',
          "password": "WrongP@ssw0rd!",
        })
        .expectStatus(400)
        
    })
  })

  describe('User', () => {
    it('GET /user/profile with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/profile')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })
    it('GET /user/profile without Authorization 401', async () => {
      await pactum.spec()
      .get('/user/profile')
      .expectStatus(401)
    })

    it('GET /user/users with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/users')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })

    it('GET /user/users without Authorization 401', async () => {
      await pactum.spec()
      .get('/user/users')
      .expectStatus(401)
    })

    it('GET ADMINS /user/roles?role=ADMIN with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/roles?role=ADMIN')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })
    it('GET CUSTOMERS /user/roles?role=CUSTOMER with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/roles?role=CUSTOMER')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })
    it('GET CUSTOMER_SUPPORTS /user/roles?role=CUSTOMER_SUPPORT with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/roles?role=CUSTOMER_SUPPORT')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })
    it('GET PHARMACISTS /user/roles?role=PHARMACIST with correct Authorization 200', async () => {
      await pactum.spec()
      .get('/user/roles?role=PHARMACIST')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })

    it('GET Wrong Role /user/roles?role=WRONG 401', async () => {
      await pactum.spec()
      .get('/user/roles?role=WRONG')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(400)
    })

    it('GET /user/roles?role=WRONG without Authorization 401', async () => {
      await pactum.spec()
      .get('/user/roles?role=WRONG')
      .expectStatus(401)
    })

    it('PATCH /user/edit with correct Authorization 200', async () => {
      await pactum.spec()
      .patch('/user/edit')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .withJson({
        "name": "John Doe",
        "phoneNumber": "123-456-7890",
        "address": "1234 Elm Street",
        "email": 'heropoter1111@gmail.com',
      })
      .expectStatus(200)
    })

    it('PATCH /user/edit without Authorization 401', async () => {
      await pactum.spec()
      .patch('/user/edit')
      .withJson({
        "name": "John Doe",
        "phoneNumber": "123-456-7890",
        "address": "1234 Elm Street",
        "email": 'heropoter1111@gmail.com',
      })
      .expectStatus(401)
    })

    it('DELETE /user/delete?id=testUserId with correct Authorization 200', async () => {
      
      await pactum.spec()
      .delete('/user/delete')
      .withQueryParams('id', testUserId)
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200);
    })
    it('DELETE /user/delete?id=testUserId without Authorization 401', async () => {
      
      await pactum.spec()
      .delete('/user/delete')
      .withQueryParams('id', testUserId)
      .expectStatus(401);
    })

  })
  describe('Medicine', () => {
    it('POST /medicine/create with correct Authorization 201', async () => {
      const createMedicine = await pactum.spec()
      .post('/medicine/create')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .withJson(MedicineData)
      .expectStatus(201)
      .returns('id'); // Store the created medicine ID

      testMedicineId = createMedicine; // Assign the created medicine ID to testMedicineId
    });
    it('POST /medicine/create with correct Authorization for order 201', async () => {
      const createMedicineTestForOrder = await pactum.spec()
      .post('/medicine/create')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .withJson({
        "medicinieName": "TEST",
        "Description": "For Back Pain",
        "price": 100,
        "stock": 500
      })
      .expectStatus(201)
      .returns('id'); // Store the created medicine ID

      testMedicineIdForOrder = createMedicineTestForOrder; // Assign the created medicine ID to testMedicineId
    });
    it('Get /medicine/all get all medicines 200', async () => {
      pactum.spec()
      .get('/medicine/all')
      .expectStatus(200)
    })
    it('Get /medicine/single get single medicine by id 200', async () => {
      pactum.spec()
      .get('/medicine/single')
      .withQueryParams('id', testMedicineId)
      .expectStatus(200)
    })
    it('PATCH /medicine/update with correct Authorization 200', async () => {
      await pactum.spec()
      .patch('/medicine/update')
      .withQueryParams('id', testMedicineId)
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .withJson({
        "medicinieName": "Panadol Extra",
        "Description": "For Back Pain",
        "price": 100,
        "stock": 1000
      })
      .expectStatus(200)
    })

    it('PATCH /medicine/update without Authorization 401', async () => {
      await pactum.spec()
      .patch('/medicine/update')
      .withQueryParams('id', testMedicineId)
      .withJson({
        "medicinieName": "Panadol Extra",
        "Description": "For Back Pain",
        "price": 100,
        "stock": 1000
      })
      .expectStatus(401)
    })

    it('DELETE /medicine/delete?id=testMedicineId with correct Authorization 200', async () => {
      
      await pactum.spec()
      .delete('/medicine/delete')
      .withQueryParams('id', testMedicineId)
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200);
    })
    it('DELETE /medicine/delete?id=testUserId without Authorization 401', async () => {
      
      await pactum.spec()
      .delete('/medicine/delete')
      .withQueryParams('id', testUserId)
      .expectStatus(401);
    })
  })
  describe('Order', () => {
    it('POST /orders/createOrder with correct Authorization 201', async () => {
      const order = await pactum.spec()
      .post('/orders/createOrder')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .withJson({
        "medicineId": testMedicineIdForOrder,
        "quantity": 10
      })
      .expectStatus(201)
      .returns('id');
      

      testOrderId = order; // Ensure the order ID is correctly assigned
    })
    it('GET /orders/userOrders get all orders 200', async () => {
      await pactum.spec()
      .get('/orders/userOrders')
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200)
    })
    it('DELETE /orders/deleteOrder with correct Authorization 200', async () => {
      await pactum.spec()
      .delete('/orders/deleteOrder')
      .withQueryParams('orderId', testOrderId)
      .withHeaders({
        'Authorization': `Bearer $S{authToken}`
      })
      .expectStatus(200);
    })
  })
})