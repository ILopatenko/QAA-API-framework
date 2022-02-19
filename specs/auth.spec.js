import { expect } from 'chai';
import AuthHelper from '../helpers/auth.helper';
import LocalHeper from '../helpers/localHelper';
const authHelper = new AuthHelper();
const localHelper = new LocalHeper();

describe('\nAuth test suite', () => {
  describe('Successful login (happy path with valid login and password)', () => {
    before(async () => {
      await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
    });
    it(`Checking that response status code is "${localHelper.testData.auth.responses.success}"`, () => {
      expect(authHelper.response.statusCode).to.eq(
        localHelper.testData.auth.responses.success
      );
    });
    it('Checking that response contains TOKEN key that is not undefined', () => {
      expect(authHelper.response.body.token).not.to.be.undefined;
    });
    it(`Checking that response contains TOKEN key with value that is "${localHelper.testData.auth.tokenLength.valid}" symbols in length`, () => {
      expect(authHelper.response.body.token.length).to.be.eq(
        localHelper.testData.auth.tokenLength.valid
      );
    });
  });

  //
  describe('Unsuccessful login sub suite - negative TCs', () => {
    describe(`Unsuccessfull login with valid login "${process.env.LOGIN}" and invalid password "${localHelper.testData.auth.invalidCredentials.password}"`, () => {
      before(async () => {
        await authHelper.login(
          process.env.LOGIN,
          localHelper.testData.auth.invalidCredentials.password
        );
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.wrongCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.wrongCred.message}"`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.message
        );
      });
    });
    //
    describe(`Unsuccessful login with invalid login "${localHelper.testData.auth.invalidCredentials.login}" and valid password "${process.env.PASSWORD}"`, () => {
      before(async () => {
        await authHelper.login(
          'localHelper.testData.auth.invalidCredentials.login',
          process.env.PASSWORD
        );
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.wrongCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.wrongCred.message}"`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.message
        );
      });
    });
    //
    describe(`Unsuccessful login with invalid login "${localHelper.testData.auth.invalidCredentials.login}" and invalid password "${localHelper.testData.auth.invalidCredentials.password}"`, () => {
      before(async () => {
        await authHelper.login(
          localHelper.testData.auth.invalidCredentials.login,
          localHelper.testData.auth.invalidCredentials.password
        );
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.wrongCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.statusCode
        );
      });
      it(`Checking that error message is ${localHelper.testData.auth.responses.error.wrongCred.message}`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.message
        );
      });
    });
    //
    describe(`Unsuccessful login with spaces only: login "${localHelper.testData.auth.spacesOnly.login}" and password "${localHelper.testData.auth.spacesOnly.password}"`, () => {
      before(async () => {
        await authHelper.login(
          localHelper.testData.auth.spacesOnly.login,
          localHelper.testData.auth.spacesOnly.password
        );
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.wrongCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.wrongCred.message}"`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.message
        );
      });
    });
    //
    //
    describe(`Unsuccessful login with login "   ${process.env.LOGIN}" and password "  ${process.env.PASSWORD}" (TRIM checking)`, () => {
      before(async () => {
        await authHelper.login(
          `    ${process.env.LOGIN}`,
          `    ${process.env.PASSWORD}`
        );
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.wrongCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.wrongCred.message}"`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.wrongCred.message
        );
      });
    });
    //
    describe('Unsuccessful login without login and password', () => {
      before(async () => {
        await authHelper.login();
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.noCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.noCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.noCred.message}`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.noCred.message
        );
      });
    });
    //

    //
    describe(`Unsuccessful login with valid login "${process.env.LOGIN}" without any password`, () => {
      before(async () => {
        await authHelper.login(process.env.LOGIN);
      });
      it(`Checking that response status code is "${localHelper.testData.auth.responses.error.noCred.statusCode}"`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.noCred.statusCode
        );
      });
      it(`Checking that error message is "${localHelper.testData.auth.responses.error.noCred.message}`, () => {
        expect(authHelper.response.body.message).to.eq(
          localHelper.testData.auth.responses.error.noCred.message
        );
      });
    });
    //
    describe(`Unsuccessful login with wrong data type: login "${localHelper.testData.auth.invalidTypeCredentials.login}" and password "${localHelper.testData.auth.invalidTypeCredentials.password}"`, () => {
      before(async () => {
        await authHelper.login(
          localHelper.testData.auth.invalidTypeCredentials.login,
          localHelper.testData.auth.invalidTypeCredentials.password
        );
      });
      it(`Checking that response status code is ${localHelper.testData.auth.responses.error.noCred.statusCode}`, () => {
        expect(authHelper.response.statusCode).to.eq(
          localHelper.testData.auth.responses.error.noCred.statusCode
        );
      });
      it('Checking that error message is "No credentials provided."', () => {
        expect(authHelper.response.body.message).to.eq(
          'No credentials provided.'
        );
      });
    });
  });
  //
});
