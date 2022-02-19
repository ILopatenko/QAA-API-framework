import { expect } from 'chai';
import UsersHelper from '../helpers/users.helper';
import getRandomItem from '../helpers/common.helper';

describe('\nUsers main test suite', () => {
  let usersHelper = new UsersHelper();
  let invalidID = 99999;
  let userID;
  before(async () => {
    await usersHelper.createNew();
    userID = usersHelper.response.body.id;
  });
  describe(' Creating a new USER - happy path with a valid token', () => {
    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains ID key that is not undefined', () => {
      expect(usersHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains AMOUNT key that is not undefined', () => {
      expect(usersHelper.response.body.amount).not.to.be.undefined;
    });
  });

  describe(' Getting USER by ID - happy path with valid ID', () => {
    before(async () => {
      await usersHelper.createNew();
      userID = usersHelper.response.body.id;
      await usersHelper.getByID(userID);
    });
    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains a user ID key that is not undefined', () => {
      expect(usersHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains a user ID key that has a correct value', () => {
      expect(usersHelper.response.body.id).to.be.eq(userID);
    });
    it('Checking that response contains AMOUNT key that is not undefined', () => {
      expect(usersHelper.response.body.amount).not.to.be.undefined;
    });
  });
  describe(' Getting USER by ID - unhappy path with invalid ID', () => {
    before(async () => {
      await usersHelper.getByID(invalidID);
    });
    it('Checking that response status code is 400', () => {
      expect(usersHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "No user found."', () => {
      expect(usersHelper.response.body.message).to.eq('No user found.');
    });
  });

  describe(' Getting all the USERS', () => {
    before(async () => {
      await usersHelper.createNew();
      await usersHelper.getAll();
    });
    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response body contains 2 or more objects', () => {
      expect(usersHelper.response.body.length).to.be.at.least(2);
    });
    it('Checking that random element in response body has an ID', () => {
      expect(getRandomItem(usersHelper.response.body).id).not.to.be.undefined;
    });
    it('Checking that random element in response body has an AMOUNT', () => {
      expect(getRandomItem(usersHelper.response.body).amount).not.to.be
        .undefined;
    });
  });

  describe(' Deleting a USER by ID - happy path (with valid ID)', () => {
    before(async () => {
      await usersHelper.deleteByID(userID);
    });

    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response body has a message "User deleted."', () => {
      expect(usersHelper.response.body.message).to.eq('User deleted.');
    });
  });
  describe(' Deleting a USER by ID - unhappy path (with invalid ID)', () => {
    before(async () => {
      await usersHelper.deleteByID(55658);
    });
    it('Checking that response status code is 400', () => {
      expect(usersHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "No user found."', () => {
      expect(usersHelper.response.body.message).to.eq('No user found.');
    });
  });
});
