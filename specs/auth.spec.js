import { expect } from 'chai';
import AuthHelper from '../helpers/auth.helper';
//This describe is a main test suite
describe('Auth test suite', () => {
  //Create a new instance of AuthHelper
  let authHelper = new AuthHelper();
  describe('  Successful login sub suite (happy path with valid login and password)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method login
      await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
    });
    it('Checking that response status code is 200', () => {
      expect(authHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains TOKEN key that is not undefined', () => {
      expect(authHelper.response.body.token).not.to.be.undefined;
    });
  });
  describe('  Unsuccessful login sub suite (unhappy path with invalid login and password)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method login
      await authHelper.login('trulala', 'tralala');
    });
    it('Checking that response status code is 404', () => {
      expect(authHelper.response.statusCode).to.eq(404);
    });
    it('Checking that error message is "Wrong login or password."', () => {
      expect(authHelper.response.body.message).to.eq(
        'Wrong login or password.'
      );
    });
  });
});
