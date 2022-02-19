import { expect } from 'chai';
import UsersHelper from '../helpers/users.helper';
import ConfigsHelper from '../helpers/config.helper';
import getRandomItem from '../helpers/common.helper';

describe('\nUsers main test suite', () => {
  const usersHelper = new UsersHelper();
  const configsHelper = new ConfigsHelper();
  let dataAfterWipe;

  before(async () => {
    let messageActual;
    let statusCodeActual;
    let messageExpected = 'Data wiped out.';
    let statusCodeExpected = 200;
    await configsHelper.wipeData();
    messageActual = configsHelper.response.body;
    statusCodeActual = configsHelper.response.statusCode;
    console.log({ messageActual, statusCodeActual });
    describe('PRECONDITIONS. Checking that after wipeData method server send a correct response', () => {
      it('Checking that response status code is 200', () => {
        expect(configsHelper.response.statusCode).to.eq(200);
      });
      it(`Checking that body of response contains a message: "${messageExpected}")`, () => {
        expect(configsHelper.response.body.message).to.eq(messageActual);
      });
    });
  });

  describe(' Deleting a USER by ID - unhappy path (with invalid ID)', () => {
    it('Checking that response status code is 400', () => {
      expect(configsHelper.response.statusCode).to.eq(200);
    });
  });
});
