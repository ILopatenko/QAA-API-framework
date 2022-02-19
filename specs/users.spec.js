import UsersHelper from '../helpers/users.helper';

import ConfigHelper from '../helpers/config.helper';
import { expect } from 'chai';
import LocalHeper from '../helpers/localHelper';
const usersHelper = new UsersHelper();
const localHelper = new LocalHeper();
const configHelper = new ConfigHelper();

describe('USERS Main Test Suite', () => {
  before(async () => {
    configHelper.wipeData();
    localHelper.wipeLocalDB();
    console.log(`ACTION: Data wiped: server+local`);
  });
  describe('Smoke Test - checking that it is possible to create a new user', () => {
    before(async () => {
      //In this BEFORE HOOK a NEW USER should be created
      await usersHelper.createNew();
    });
    after(async () => {
      //In this AFTER HOOK a NEW USER should be added to a localDB (hook will be runned only if all the tests will be passed successfully)
      localHelper.addUserToLocalDB(usersHelper.response.body);
    });
    describe(' Creating a new USER - happy path with valid token', () => {
      it(`Checking that response status code is "${localHelper.testData.users.responses.success}"`, () => {
        expect(usersHelper.response.statusCode).to.eq(
          localHelper.testData.users.responses.success
        );
      });
      it('Checking that response contains ID key that is not undefined', () => {
        expect(usersHelper.response.body.id).not.to.be.undefined;
      });
      it(`Checking that response body has ID key with value that is "${localHelper.testData.auth.tokenLength.valid}" symbols in length`, () => {
        expect(usersHelper.response.body.id.length).to.be.eq(
          localHelper.testData.auth.tokenLength.valid
        );
      });
      it('Checking that response contains AMOUNT key that is not undefined', () => {
        expect(usersHelper.response.body.amount).not.to.be.undefined;
      });
      it(`Checking that response body has AMOUNT key with value "${localHelper.testData.config.amount}"`, () => {
        expect(usersHelper.response.body.amount).to.be.eq(
          localHelper.testData.config.amount
        );
      });
    });
  });

  //
  describe('Getting USER by ID', () => {
    describe('Positive TC - happy path with valid USER ID', () => {
      before(async () => {
        localHelper.setLocalTestUser();
        await usersHelper.getByID(localHelper.localTestUser.id);
      });
      it(`Checking that response status code is "${localHelper.testData.users.responses.success}"`, () => {
        expect(usersHelper.response.statusCode).to.eq(
          localHelper.testData.users.responses.success
        );
      });
      it('Checking that response contains ID key that is not undefined', () => {
        expect(usersHelper.response.body.id).not.to.be.undefined;
      });
      it(`Checking that response body has ID key with value that is "${localHelper.testData.auth.tokenLength.valid}" symbols in length`, () => {
        expect(usersHelper.response.body.id.length).to.be.eq(
          localHelper.testData.auth.tokenLength.valid
        );
      });
      it('Checking that response contains AMOUNT key that is not undefined', () => {
        expect(usersHelper.response.body.amount).not.to.be.undefined;
      });
      it(`Checking that response body has AMOUNT key with value "${localHelper.testData.config.amount}"`, () => {
        expect(usersHelper.response.body.amount).to.be.eq(
          localHelper.testData.config.amount
        );
      });
      it(`Checking that response returned the same object as expected`, () => {
        expect(usersHelper.response.body).to.deep.eq(localHelper.localTestUser);
      });
    });
    //
    describe('Negative TCs - unhappy path with invalid USER ID', () => {
      describe(`Trying to get USER with wrong USER ID "${localHelper.testData.users.invalidCredentials.unrealUser.id}"`, () => {
        before(async () => {
          await usersHelper.getByID(
            localHelper.testData.users.invalidCredentials.unrealUser.id
          );
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });

      describe('Trying to get USER without USER ID', () => {
        before(async () => {
          await usersHelper.getByID();
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });
      //
      describe(`Trying to get USER with invalid type of USER ID "${localHelper.testData.users.invalidCredentials.wrongIDtype.id}"`, () => {
        before(async () => {
          await usersHelper.getByID(
            localHelper.testData.users.invalidCredentials.wrongIDtype.id
          );
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });

    });
    //
  });

  //

  describe('Deleting USER by ID', () => {
    describe(`Negative TCs - unhappy path with invalid USER ID `, () => {
      describe(`Trying to DELETE USER with wrong USER ID"${localHelper.testData.users.invalidCredentials.unrealUser.id}"`, () => {
        before(async () => {
          await usersHelper.deleteByID(
            localHelper.testData.users.invalidCredentials.unrealUser.id
          );
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });

      describe('Trying to DELETE USER without USER ID', () => {
        before(async () => {
          await usersHelper.deleteByID();
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });
      //
      describe(`Trying to DELETE USER with invalid USER ID "${localHelper.testData.users.invalidCredentials.wrongIDtype.id}"`, () => {
        before(async () => {
          await usersHelper.deleteByID(
            localHelper.testData.users.invalidCredentials.wrongIDtype.id
          );
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });

    });
    //
    describe('Positive TC - happy path with valid USER ID', () => {
      before(async () => {
        await usersHelper.deleteByID(localHelper.localTestUser.id);
      });
      after(async () => {
        await usersHelper.deleteByID(localHelper.localTestUser.id);
      });
      it(`Checking that response status code is "${localHelper.testData.users.responses.success}"`, () => {
        expect(usersHelper.response.statusCode).to.eq(
          localHelper.testData.users.responses.success
        );
      });
      it(`Checking that response message is "${localHelper.testData.users.responses.successDelete.message}"`, () => {
        expect(usersHelper.response.body.message).to.be.eq(
          localHelper.testData.users.responses.successDelete.message
        );
      });
      describe(`Checking that user really was deleted: trying to get USER by ID `, () => {
        before(async () => {
          await usersHelper.getByID(localHelper.localTestUser.id);
        });
        it(`Checking that response status code is "${localHelper.testData.users.responses.error.noUserFound.statusCode}"`, () => {
          expect(usersHelper.response.statusCode).to.eq(
            localHelper.testData.users.responses.error.noUserFound.statusCode
          );
        });
        it(`Checking that response message is "${localHelper.testData.users.responses.error.noUserFound.message}"`, () => {
          expect(usersHelper.response.body.message).to.be.eq(
            localHelper.testData.users.responses.error.noUserFound.message
          );
        });
      });
    });

    //

    //
  });
  describe('Getting all the USERS', () => {

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
      localHelper.setLocalTestUser();
      await usersHelper.getAll();
    });
    it(`Checking that response status code is "${localHelper.testData.users.responses.success}"`, () => {
      expect(usersHelper.response.statusCode).to.eq(
        localHelper.testData.users.responses.success
      );
    });
    it('Checking that body of response is not undefined', () => {
      expect(usersHelper.response.body).not.to.be.undefined;
    });
    it('Checking that body of response contains the same amount of objects (users) as expected', () => {
      expect(usersHelper.response.body.length).to.be.eq(
        localHelper.localDB.users.length
      );
    });

    after(async () => {
      configHelper.wipeData();
      localHelper.wipeLocalDB();
      console.log(`ACTION: Data wiped: server+local`);

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
