import { expect } from 'chai';
import UsersHelper from '../helpers/users.helper';
import getRandomItem from '../helpers/common.helper';

describe('\nUsers main test suite', () => {
  let usersHelper = new UsersHelper();
  let userID;

  before(async () => {
    await usersHelper.createNew();
    userID = usersHelper.response.body.id;
  });

  describe(' Creating a new USER', () => {
    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains a user ID', () => {
      expect(usersHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains an initial AMOUNT', () => {
      expect(usersHelper.response.body.amount).not.to.be.undefined;
    });
  });

  describe(' Getting USER by ID', () => {
    before(async () => {
      await usersHelper.getByID(userID);
    });

    it('Checking that response status code is 200', () => {
      expect(usersHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains a user ID', () => {
      expect(usersHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains an initial AMOUNT', () => {
      expect(usersHelper.response.body.amount).not.to.be.undefined;
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

  describe(' Deleting a USER by ID', () => {
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
});
