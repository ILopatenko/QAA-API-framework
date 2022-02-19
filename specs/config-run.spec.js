import { expect } from 'chai';
import ConfigHelper from '../helpers/config.helper';
//This describe is a main test suite
describe('Config test suite', () => {
  let validEntity = 25;
  let invalidEntity = 999;
  let valid_initial_amount = 1000;

  //Create a new instance of AuthHelper
  let configHelper = new ConfigHelper();
  describe('  Getting all the configurations', () => {
    before(async () => {
      await configHelper.getConfig();
    });
    it('Checking that response status code is 200', () => {
      expect(configHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains number_of_entries key that is not undefined', () => {
      expect(configHelper.response.body.number_of_entries).not.to.be.undefined;
    });
    it('Checking that response contains initial_amount key that is not undefined', () => {
      expect(configHelper.response.body.initial_amount).not.to.be.undefined;
    });
  });

  describe(`  Editing all the configurations - happy path with valid values - number_of_entries=${validEntity} and initial_amount=${valid_initial_amount}`, () => {
    before(async () => {
      await configHelper.editConfig(validEntity, valid_initial_amount);
    });
    it('Checking that response status code is 200', () => {
      expect(configHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains number_of_entries key that is not undefined', () => {
      expect(configHelper.response.body.number_of_entries).not.to.be.undefined;
    });
    it(`Checking that number_of_entries key has value ${validEntity}`, () => {
      expect(configHelper.response.body.number_of_entries).to.be.eq(
        validEntity
      );
    });
    it('Checking that response contains initial_amount key that is not undefined', () => {
      expect(configHelper.response.body.initial_amount).not.to.be.undefined;
    });
    it(`Checking that initial_amount key has value ${valid_initial_amount}`, () => {
      expect(configHelper.response.body.initial_amount).to.be.eq(
        valid_initial_amount
      );
    });
  });

  describe(`  Editing all the configurations - unhappy path with invalid values - number_of_entries=${invalidEntity} and initial_amount=${valid_initial_amount}`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method login
      await configHelper.editConfig(invalidEntity, valid_initial_amount);
    });
    it('Checking that response status code is 400', () => {
      expect(configHelper.response.statusCode).to.eq(400);
    });
    it('Checking that response body has an error message "Number of entries must be between 5 and 25 (inclusively).', () => {
      expect(configHelper.response.body.message).to.eq(
        'Number of entries must be between 5 and 25 (inclusively).'
      );
    });
  });
});
