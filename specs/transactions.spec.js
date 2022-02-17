import { expect } from 'chai';
import TransactionsHelper from '../helpers/transactions.helper';
import UsersHelper from '../helpers/users.helper';
import getRandomItem from '../helpers/common.helper';
//This describe is a main test suite
describe('Transactions test suite', () => {
  //Create a new instance of AuthHelper
  let transactionsHelper = new TransactionsHelper();
  let usersHelper = new UsersHelper();
  let user1ID;
  let user2ID;
  let user3ID;
  let user4ID;
  let amount1 = Math.floor(Math.random() * 300);
  let amount2 = Math.floor(Math.random() * 300);

  //Preconditions: we have to create 2 users to be able to make 1 transaction
  before(async () => {
    await usersHelper.createNew();
    user1ID = usersHelper.response.body.id;
    await usersHelper.createNew();
    user2ID = usersHelper.response.body.id;
  });

  describe('  Successful creating a transaction between 2 users (happy path with valid credentials)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(user1ID, user2ID, amount1);
    });
    it('Checking that response status code is 200', () => {
      expect(transactionsHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains ID key that is not undefined', () => {
      expect(transactionsHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains FROM key that is not undefined', () => {
      expect(transactionsHelper.response.body.from).not.to.be.undefined;
    });
    it('Checking that FROM key in response has a correct value', () => {
      expect(transactionsHelper.response.body.from).to.eq(user1ID);
    });
    it('Checking that response contains TO key that is not undefined', () => {
      expect(transactionsHelper.response.body.to).not.to.be.undefined;
    });
    it('Checking that TO key in response has a correct value', () => {
      expect(transactionsHelper.response.body.to).to.eq(user2ID);
    });
    it('Checking that response contains AMOUNT key that is not undefined', () => {
      expect(transactionsHelper.response.body.amount).not.to.be.undefined;
    });
    it('Checking that AMOUNT key in response has a correct value', () => {
      expect(transactionsHelper.response.body.amount).to.eq(amount1);
    });
  });
  describe('  Unsuccessful creating a transaction between 2 users (unhappy path with invalid SENDER ID === 654654654)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(654654654, user2ID, 25564);
    });
    it('Checking that response status code is 400', () => {
      expect(transactionsHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "Sender not found."', () => {
      expect(transactionsHelper.response.body.message).to.eq(
        'Sender not found.'
      );
    });
  });
  describe('  Unsuccessful creating a transaction between 2 users (unhappy path with invalid RECEIVER ID === 56454)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(user1ID, 56454, 25564);
    });
    it('Checking that response status code is 400', () => {
      expect(transactionsHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "Receiver not found."', () => {
      expect(transactionsHelper.response.body.message).to.eq(
        'Receiver not found.'
      );
    });
  });
  describe('  Unsuccessful creating a transaction between 2 users (unhappy path with invalid AMOUNT==="hello")', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(user1ID, user2ID, 'hello');
    });
    it('Checking that response status code is 400', () => {
      expect(transactionsHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "Invalid amount to send."', () => {
      expect(transactionsHelper.response.body.message).to.eq(
        'Invalid amount to send.'
      );
    });
  });
  describe('  Getting all the transactions', () => {
    before(async () => {
      //BEFORE hook - will be runned 1st (before all other suits/tests)
      await usersHelper.createNew();
      user3ID = usersHelper.response.body.id;
      await usersHelper.createNew();
      user4ID = usersHelper.response.body.id;
      await transactionsHelper.create(user3ID, user4ID, amount2);
      //Send async request using our HELPER method create
      await transactionsHelper.getAll();
    });
    it('Checking that response status code is 200', () => {
      expect(transactionsHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response body contains 2 objects', () => {
      expect(transactionsHelper.response.body.length).to.be.at.least(2);
    });
    it('Checking that random element in response body has ID key that is not undefined', () => {
      expect(getRandomItem(transactionsHelper.response.body).id).not.to.be
        .undefined;
    });
    it('Checking that random element in response body has AMOUNT key that is not undefined', () => {
      expect(getRandomItem(transactionsHelper.response.body).amount).not.to.be
        .undefined;
    });
    it('Checking that random element in response body has FROM key that is not undefined', () => {
      expect(getRandomItem(transactionsHelper.response.body).from).not.to.be
        .undefined;
    });
    it('Checking that random element in response body has TO key that is not undefined', () => {
      expect(getRandomItem(transactionsHelper.response.body).to).not.to.be
        .undefined;
    });
  });

  describe('  Get a transaction by ID - happy path with valid TRANSACTION ID', () => {
    before(async () => {
      let id = transactionsHelper.response.body[0].id;
      await transactionsHelper.getByID(id);
    });
    it('Checking that response status code is 200', () => {
      expect(transactionsHelper.response.statusCode).to.eq(200);
    });

    it('Checking that response body has ID key that is not undefined', () => {
      expect(transactionsHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response body has AMOUNT key that is not undefined', () => {
      expect(transactionsHelper.response.body.amount).not.to.be.undefined;
    });
    it('Checking that response body has FROM key that is not undefined', () => {
      expect(transactionsHelper.response.body.from).not.to.be.undefined;
    });
    it('Checking that response body has TO key that is not undefined', () => {
      expect(transactionsHelper.response.body.to).not.to.be.undefined;
    });
  });
  describe('  Get a transaction by ID - unhappy path with invalid TRANSACTION ID', () => {
    before(async () => {
      await transactionsHelper.getByID(6546844);
    });
    it('Checking that response status code is 400', () => {
      expect(transactionsHelper.response.statusCode).to.eq(400);
    });

    it('Checking that response body has an error message "No transaction found."', () => {
      expect(transactionsHelper.response.body.message).to.eq(
        'No transaction found.'
      );
    });
  });
});
