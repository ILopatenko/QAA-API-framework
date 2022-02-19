import { expect } from 'chai';
import TransactionsHelper from '../helpers/transactions.helper';
import UsersHelper from '../helpers/users.helper';

import ConfigHelper from '../helpers/config.helper';
import LocalHelper from '../helpers/localHelper';
//This describe is a main test suite
describe('Transactions test suite', () => {
  //Create a new instance of AuthHelper
  let transactionsHelper = new TransactionsHelper();
  let usersHelper = new UsersHelper();
  const configHelper = new ConfigHelper();
  const localHelper = new LocalHelper();

  before(async () => {
    //PRECONDITIONS: wipe server data, wipe localDB, add 12 new users
    configHelper.wipeData();
    localHelper.wipeLocalDB();
    console.log(`ACTION: Data wiped: server+local`);
    for (let i = 0; i < 12; i++) {
      await usersHelper.createNew();
      if (usersHelper.response.statusCode === 200) {
        localHelper.addUserToLocalDB(usersHelper.response.body);
      }
    }
    console.log(`ACTION: 12 new users were added (server+localDB)`);
  });

  describe('Successful creating 10 transaction between 2 users (happy path with valid credentials) and checking last one', () => {
    before(async () => {
      //Generate valid data for transaction
      let transaction;
      for (let i = 0; i < 10; i++) {
        transaction = localHelper.generateRandomTransaction(
          localHelper.localDB.users
        );
        await transactionsHelper.create(
          transaction.from.id,
          transaction.to.id,
          transaction.amount
        );
        localHelper.addNewTransactionToLocalDB(
          transactionsHelper.response.body
        );
      }
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.succsess.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.succsess.statusCode
      );
    });
    it('Checking that response contains ID key that is not undefined', () => {
      expect(transactionsHelper.response.body.id).not.to.be.undefined;
    });
    it('Checking that response contains FROM key that is not undefined', () => {
      expect(transactionsHelper.response.body.from).not.to.be.undefined;
    });
    it(`Checking that FROM key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.from).to.eq(
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].from
      );
    });
    it('Checking that response contains TO key that is not undefined', () => {
      expect(transactionsHelper.response.body.to).not.to.be.undefined;
    });
    it(`Checking that TO key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.to).to.eq(
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].to
      );
    });
    it('Checking that response contains AMOUNT key that is not undefined', () => {
      expect(transactionsHelper.response.body.amount).not.to.be.undefined;
    });
    it(`Checking that AMOUNT key in response has a correct value`, () => {
      expect(transactionsHelper.response.body.amount).to.eq(
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].amount
      );
    });
  });
  describe(`Unsuccessful creating a transaction between 2 users (unhappy path with invalid SENDER ID "${localHelper.testData.transaction.responses.error.wrongFromID.id})`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(
        localHelper.testData.transaction.responses.error.wrongFromID.id,
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].to,
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].amount
      );
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.error.wrongFromID.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.error.wrongFromID.statusCode
      );
    });
    it(`Checking that response body has an error message "${localHelper.testData.transaction.responses.error.wrongFromID.message}"`, () => {
      expect(transactionsHelper.response.body.message).to.eq(
        localHelper.testData.transaction.responses.error.wrongFromID.message
      );
    });
  });
  describe(`Unsuccessful creating a transaction between 2 users (unhappy path with invalid RECEIVER ID ${localHelper.testData.transaction.responses.error.wrongToID.id})`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].from,
        localHelper.testData.transaction.responses.error.wrongToID.id,
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].amount
      );
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.error.wrongToID.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.error.wrongToID.statusCode
      );
    });
    it('Checking that response body has an error message "Receiver not found."', () => {
      expect(transactionsHelper.response.body.message).to.eq(
        'Receiver not found.'
      );
    });
  });
  describe(`Unsuccessful creating a transaction between 2 users (unhappy path with invalid AMOUNT ${localHelper.testData.transaction.responses.error.wrongTypeAmount.amount})`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method create
      await transactionsHelper.create(
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].from,
        localHelper.localDB.transactions[
          localHelper.localDB.transactions.length - 1
        ].to,
        localHelper.testData.transaction.responses.error.wrongTypeAmount.amount
      );
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.error.wrongTypeAmount.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.error.wrongTypeAmount
          .statusCode
      );
    });
    it(`Checking that response body has an error message "${localHelper.testData.transaction.responses.error.wrongTypeAmount.message}"`, () => {
      expect(transactionsHelper.response.body.message).to.eq(
        localHelper.testData.transaction.responses.error.wrongTypeAmount.message
      );
    });
  });
  describe('Getting all the transactions', () => {
    before(async () => {
      await transactionsHelper.getAll();
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.succsess.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.succsess.statusCode
      );
    });
    it(`Checking that response body contains "${localHelper.localDB.transactions.length}" objects`, () => {
      expect(transactionsHelper.response.body.length).to.be.eq(
        localHelper.localDB.transactions.length
      );
    });
    it('Checking that random element in response body has ID key that is not undefined', () => {
      expect(
        transactionsHelper.response.body[
          localHelper.getRandomUpTo(transactionsHelper.response.body.length)
        ].id
      ).not.to.be.undefined;
    });
    it('Checking that random element in response body has AMOUNT key that is not undefined', () => {
      expect(
        transactionsHelper.response.body[
          localHelper.getRandomUpTo(transactionsHelper.response.body.length)
        ].amount
      ).not.to.be.undefined;
    });
    it('Checking that random element in response body has FROM key that is not undefined', () => {
      expect(
        transactionsHelper.response.body[
          localHelper.getRandomUpTo(transactionsHelper.response.body.length)
        ].from
      ).not.to.be.undefined;
    });
    it('Checking that random element in response body has TO key that is not undefined', () => {
      expect(
        transactionsHelper.response.body[
          localHelper.getRandomUpTo(transactionsHelper.response.body.length)
        ].to
      ).not.to.be.undefined;
    });
  });
  describe('  Get a transaction by ID - happy path with valid TRANSACTION ID', () => {
    before(async () => {
      await transactionsHelper.getByID(
        transactionsHelper.response.body[
          localHelper.getRandomUpTo(transactionsHelper.response.body.length)
        ].id
      );
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.succsess.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.succsess.statusCode
      );
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
  describe(`Get a transaction by ID - unhappy path with invalid TRANSACTION ID ${localHelper.testData.transaction.responses.error.randomTransactionID.id}`, () => {
    before(async () => {
      await transactionsHelper.getByID(
        localHelper.testData.transaction.responses.error.randomTransactionID.id
      );
    });
    it(`Checking that response status code is "${localHelper.testData.transaction.responses.error.randomTransactionID.statusCode}"`, () => {
      expect(transactionsHelper.response.statusCode).to.eq(
        localHelper.testData.transaction.responses.error.randomTransactionID
          .statusCode
      );
    });
    it(`Checking that response body has an error message "${localHelper.testData.transaction.responses.error.randomTransactionID.message}"`, () => {
      expect(transactionsHelper.response.body.message).to.eq(
        localHelper.testData.transaction.responses.error.randomTransactionID
          .message
      );
    });
  });
});
