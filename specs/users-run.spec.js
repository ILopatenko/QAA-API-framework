import UsersHelper from '../helpers/users.helper';
import ConfigHelper from '../helpers/config.helper';
import { getRandomItem } from '../helpers/common.helper';
import { expect, use } from 'chai';
import CommonHelper from '../helpers/common.helper';
const usersHelper = new UsersHelper();
const commonHelper = new CommonHelper();
const configHelper = new ConfigHelper();
let testUser;
let testRandomID;
let localArr;

describe('USERS Main Test Suite', () => {
  describe('\nSmoke Test - checking that it is possible to create a new user', () => {
    before(async () => {
      await configHelper.wipeData();
      await usersHelper.createNew();
    });
    describe(' Creating a new USER - happy path with a valid token', () => {
      it('Checking that response status code is 200', () => {
        expect(usersHelper.response.statusCode).to.eq(200);
      });
      it('Checking that response contains ID key that is not undefined', () => {
        expect(usersHelper.response.body.id).not.to.be.undefined;
      });
      it(`Checking that response body has ID key with value that is 36 symbols in length`, () => {
        expect(usersHelper.response.body.id.length).to.be.eq(36);
      });
      it('Checking that response contains AMOUNT key that is not undefined', () => {
        expect(usersHelper.response.body.amount).not.to.be.undefined;
      });
      it(`Checking that response body has AMOUNT key with value 5000`, () => {
        expect(usersHelper.response.body.amount).to.be.eq(1000);
      });
    });
  });

  //
  describe('\nGetting USER by ID', () => {
    describe('Positive TC - happy path with valid USER ID', () => {
      before(async () => {
        testUser = usersHelper.response.body;
        await usersHelper.getByID(testUser.id);
      });
      it('Checking that response status code is 200', () => {
        expect(usersHelper.response.statusCode).to.eq(200);
      });
      it('Checking that response contains ID key that is not undefined', () => {
        expect(usersHelper.response.body.id).not.to.be.undefined;
      });
      it(`Checking that response body has ID key with value that is 36 symbols in length`, () => {
        expect(usersHelper.response.body.id.length).to.be.eq(36);
      });
      it('Checking that response contains AMOUNT key that is not undefined', () => {
        expect(usersHelper.response.body.amount).not.to.be.undefined;
      });
      it(`Checking that response body has AMOUNT key with value 5000`, () => {
        expect(usersHelper.response.body.amount).to.be.eq(1000);
      });
      it(`Checking that response returned the same object as expected`, () => {
        expect(usersHelper.response.body).to.deep.eq(testUser);
      });
    });
    //
    describe('Negative TCs - unhappy path with invalid USER ID', () => {
      describe('Trying to get USER with wrong USER ID = 666555', () => {
        before(async () => {
          await usersHelper.getByID(666555);
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });

      describe('Trying to get USER without USER ID', () => {
        before(async () => {
          await usersHelper.getByID();
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });
      //
      describe('Trying to get USER with invalid USER ID = true', () => {
        before(async () => {
          await usersHelper.getByID(true);
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });
    });
    //
  });
  //

  describe('\nDeleting USER by ID', () => {
    describe('Negative TCs - unhappy path with invalid USER ID', () => {
      describe('Trying to DELETE USER with wrong USER ID = 666555', () => {
        before(async () => {
          await usersHelper.deleteByID(666555);
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });

      describe('Trying to DELETE USER without USER ID', () => {
        before(async () => {
          await usersHelper.deleteByID();
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });
      //
      describe('Trying to DELETE USER with invalid USER ID = true', () => {
        before(async () => {
          await usersHelper.deleteByID(true);
        });
        it('Checking that response status code is 200', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });
    });
    //
    describe('Positive TC - happy path with valid USER ID', () => {
      before(async () => {
        await usersHelper.deleteByID(testUser.id);
      });
      it('Checking that response status code is 200', () => {
        expect(usersHelper.response.statusCode).to.eq(200);
      });
      it(`Checking that response message is "No user found."`, () => {
        expect(usersHelper.response.body.message).to.be.eq('User deleted.');
      });
      describe(`Checking that user really was deleted: trying to get USER by ID`, () => {
        before(async () => {
          await usersHelper.getByID(testUser.id);
        });
        it('Checking that response status code is 400', () => {
          expect(usersHelper.response.statusCode).to.eq(400);
        });
        it(`Checking that response message is "No user found."`, () => {
          expect(usersHelper.response.body.message).to.be.eq('No user found.');
        });
      });
    });
    //
    describe('Getting all the USERS', () => {
      before(async () => {
        localArr = await commonHelper.createAndAddUser(5);
        await usersHelper.getAll();
        testRandomID = commonHelper.generateRandom(localArr.length);
      });
      it('Checking that response status code is 200', () => {
        expect(usersHelper.response.statusCode).to.eq(200);
      });
      it('Checking that body of response is not undefined', () => {
        expect(usersHelper.response.body).not.to.be.undefined;
      });
      it('Checking that body of response contains the same amount of objects (users) as expected', () => {
        expect(usersHelper.response.body.length).to.be.eq(localArr.length);
      });
      it('Checking 1 random USER (deep ecuality)', () => {
        expect(localArr[testRandomID]).to.be.deep.eq(
          usersHelper.response.body[testRandomID]
        );
      });

      after(async () => {
        await configHelper.wipeData();
        console.log('wiped');
      });
    });
    //
  });
});
