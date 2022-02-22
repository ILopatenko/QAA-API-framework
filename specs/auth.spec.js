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
});
