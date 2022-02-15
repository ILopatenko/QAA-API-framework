//Imports block
import { expect } from 'chai';
import supertest from 'supertest';
//
//describe is a test suit that can contain another test sub suits or test cases
describe('Auth', () => {
  //Create a request object
  const request = supertest('https://paysis.herokuapp.com');

  //it is a test case with a couple of assertions
  it('Successfull login (happy path, positive tests)', () => {
    //Use inner methods to add all the parameters to a request using chaining methods
    request
      //Setup a request method - POST and an endpoint - /auth
      .post('/auth')
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ login: 'adminius', password: 'supers3cret' })
      //Tests block that can handle error or response
      .end((err, res) => {
        //Test that status code in response equals to 200
        expect(res.statusCode).to.eq(200);
        //Test that response has body, body has token key and that token key is not undefined
        expect(res.body.token).not.to.be.undefined;
      });
  });

  //
  //it is a test case with a couple of assertions
  it('Unsuccessfull login (unhappy path, negative tests)', () => {
    //Use inner methods to add all the parameters to a request using chaining methods
    request
      //Setup a request method - POST and an endpoint - /auth
      .post('/auth')
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ login: 'wrongLogin', password: 'wrongPassword' })
      //Tests block that can handle error or response
      .end((err, res) => {
        //Test that status code in response equals to 404
        expect(res.statusCode).to.eq(404);
        //Test that error message equals to 'Wrong login or password.'
        expect(res.body.message).to.eq('Wrong login or password.');
      });
  });
});
