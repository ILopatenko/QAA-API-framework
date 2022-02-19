import { expect } from 'chai';
import TransactionsHelper from '../helpers/transactions.helper';
import UsersHelper from '../helpers/users.helper';
import getRandomItem from '../helpers/common.helper';
import ConfigHelper from '../helpers/config.helper';
import CommonHelper from '../helpers/common.helper';
//This describe is a main test suite
describe('Transactions test suite', () => {
  //Create a new instance of AuthHelper
  let transactionsHelper = new TransactionsHelper();
  let usersHelper = new UsersHelper();
  const configHelper = new ConfigHelper();
  const commonHelper = new CommonHelper();
  let localDB;
  let testTransaction;
  before(async () => {
    //PRECONDITIONS: Wipe all the data and create 6 new users
    await configHelper.wipeData();
    console.log(`data was wiped`);
    localDB = await commonHelper.createAndAddUser(6);
  });

  describe('  Successful creating a transaction between 2 users (happy path with valid credentials)', () => {
    before(async () => {
      //TEST
      testTransaction = commonHelper.generateValidTransactionBetweenTwoUsers(
        localDB.users
      );
      console.log('generated transaction is ', testTransaction);

      await transactionsHelper.create(
        testTransaction[0],
        testTransaction[1],
        testTransaction[2]
      );
      console.log(
        `transactionsHelper.response.body`,
        transactionsHelper.response.body
      );
      localDB.transactions.push(transactionsHelper.response.body);
      console.log('localDb after adding a new transaction', localDB);
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
    it(`Checking that FROM key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.from).to.eq(testTransaction[0]);
    });
    it('Checking that response contains TO key that is not undefined', () => {
      expect(transactionsHelper.response.body.to).not.to.be.undefined;
    });
    it(`Checking that TO key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.to).to.eq(testTransaction[1]);
    });
    it('Checking that response contains AMOUNT key that is not undefined', () => {
      expect(transactionsHelper.response.body.amount).not.to.be.undefined;
    });
    it(`Checking that AMOUNT key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.amount).to.eq(testTransaction[2]);
    });
  });
  describe('  Unsuccessful creating a transaction between 2 users (unhappy path with invalid SENDER ID === 654654654)', () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(
        654654654,
        testTransaction[1],
        testTransaction[2]
      );
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
      await transactionsHelper.create(
        testTransaction[0],
        56454,
        testTransaction[2]
      );
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
      await transactionsHelper.create(
        testTransaction[0],
        testTransaction[1],
        'hello'
      );
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
      testTransaction = commonHelper.generateValidTransactionBetweenTwoUsers(
        localDB.users
      );

      await transactionsHelper.create(
        testTransaction[0],
        testTransaction[1],
        testTransaction[2]
      );
      localDB.transactions.push(transactionsHelper.response.body);
      testTransaction = commonHelper.generateValidTransactionBetweenTwoUsers(
        localDB.users
      );
      await transactionsHelper.create(
        testTransaction[0],
        testTransaction[1],
        testTransaction[2]
      );
      localDB.transactions.push(transactionsHelper.response.body);
      await transactionsHelper.getAll();
    });
    it('Checking that response status code is 200', () => {
      expect(transactionsHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response body contains 3 objects', () => {
      expect(transactionsHelper.response.body.length).to.be.eq(3);
    });
    it('Checking that random element in response body has ID key that is not undefined', () => {
      console.log(usersHelper.getRandomItem(transactionsHelper.response.body));
      expect(usersHelper.getRandomItem(transactionsHelper.response.body).id).not
        .to.be.undefined;

      console.log(usersHelper.getRandomItem(transactionsHelper.response.body));
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
