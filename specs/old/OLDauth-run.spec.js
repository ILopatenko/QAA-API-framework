import { expect } from 'chai';
import AuthHelper from '../../helpers/auth.helper';
const authHelper = new AuthHelper();
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
  it('Checking that response contains TOKEN key with value that is 36 symbols in length', () => {
    expect(authHelper.response.body.token.length).to.be.eq(36);
  });
});
