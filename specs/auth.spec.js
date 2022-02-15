import { expect } from 'chai';
import supertest from 'supertest';
//This describe is a main test suite
describe('Auth test suite', () => {
  //Create a request object
  const request = supertest(process.env.BASE_URL);
  //Create a new variable to store a response from server
  let result;
  describe('Successful login sub suite (happy path, positive tests)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request
      await request
        //Setup a request method - POST and an endpoint - /auth
        .post('/auth')
        //Setup payload - object with 2 keys - login and password (and their values)
        .send({ login: process.env.LOGIN, password: process.env.PASSWORD })
        //Save a response from server to result variable
        .then((res) => {
          result = res;
        });
    });
    it('Checking that response status code is 200', () => {
      expect(result.statusCode).to.eq(200);
    });
    it('Checking that response contains an authorization token', () => {
      expect(result.body.token).not.to.be.undefined;
    });
  });
  describe('Unsuccessful login sub suite (unhappy path, negative tests)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request
      await request
        //Setup a request method - POST and an endpoint - /auth
        .post('/auth')
        //Setup payload - object with 2 keys - login and password (and their values)
        .send({ login: 'tralala', password: 'trulala' })
        //Save a response from server to result variable
        .then((res) => {
          result = res;
        });
    });
    it('Checking that response status code is 404', () => {
      expect(result.statusCode).to.eq(404);
    });
    it('Checking that error message is "Wrong login or password."', () => {
      expect(result.body.message).to.eq('Wrong login or password.');
    });
  });
});
