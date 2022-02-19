import { expect } from 'chai';
import AuthHelper from '../helpers/auth.helper';
const authHelper = new AuthHelper();
describe('Auth test suite', () => {
  describe('\nSuccessful login sub suite (happy path with valid login and password)', () => {
    before(async () => {
      await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
    });
    it('Checking that response status code is 200', () => {
      expect(authHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains TOKEN key that is not undefined', () => {
      expect(authHelper.response.body.token).not.to.be.undefined;
    });
    it(`Checking that response contains TOKEN key with value that is 36 symbols in length`, () => {
      expect(authHelper.response.body.token.length).to.be.eq(36);
    });
  });
  //
  describe('\nUnsuccessful login sub suite', () => {
    describe('Valid login and invalid password', () => {
      before(async () => {
        await authHelper.login(process.env.LOGIN, 'tralala');
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
    //
    before(async () => {
      await authHelper.login('trulala', process.env.PASSWORD);
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
  //
  describe('Invalid login and invalid password', () => {
    before(async () => {
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
  //
  describe('Attempt to login without login and password', () => {
    before(async () => {
      await authHelper.login();
    });
    it('Checking that response status code is 400', () => {
      expect(authHelper.response.statusCode).to.eq(400);
    });
    it('Checking that error message is "No credentials provided."', () => {
      expect(authHelper.response.body.message).to.eq(
        'No credentials provided.'
      );
    });
  });
  //
  describe('Attempt to login with only 1 parameter (valid login)', () => {
    before(async () => {
      await authHelper.login(process.env.LOGIN);
    });
    it('Checking that response status code is 400', () => {
      expect(authHelper.response.statusCode).to.eq(400);
    });
    it('Checking that error message is "No credentials provided."', () => {
      expect(authHelper.response.body.message).to.eq(
        'No credentials provided.'
      );
    });
  });
  //
  describe('Attempt to login with wrond data type login = true and password = undefined', () => {
    before(async () => {
      await authHelper.login(true, undefined);
    });
    it('Checking that response status code is 400', () => {
      expect(authHelper.response.statusCode).to.eq(400);
    });
    it('Checking that error message is "No credentials provided."', () => {
      expect(authHelper.response.body.message).to.eq(
        'No credentials provided.'
      );
    });
  });

  //
});
