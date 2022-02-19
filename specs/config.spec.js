import { expect } from 'chai';
import ConfigHelper from '../helpers/config.helper';
import LocalHeper from '../helpers/localHelper';
//This describe is a main test suite
let configHelper = new ConfigHelper();
let localHeper = new LocalHeper();
describe('Config test suite', () => {
  //Create a new instance of AuthHelper

  describe('Getting all the configurations', () => {
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

  describe(`Editing all the configurations - happy path with valid values - number_of_entries "${localHeper.testData.config.validConfig.number_of_entries}" and initial_amount "${localHeper.testData.config.validConfig.initial_amount}"`, () => {
    before(async () => {
      await configHelper.editConfig(
        localHeper.testData.config.validConfig.number_of_entries,
        localHeper.testData.config.validConfig.initial_amount
      );
    });
    it('Checking that response status code is 200', () => {
      expect(configHelper.response.statusCode).to.eq(200);
    });
    it('Checking that response contains number_of_entries key that is not undefined', () => {
      expect(configHelper.response.body.number_of_entries).not.to.be.undefined;
    });
    it(`Checking that number_of_entries key has value ${localHeper.testData.config.validConfig.number_of_entries}`, () => {
      expect(configHelper.response.body.number_of_entries).to.be.eq(
        localHeper.testData.config.validConfig.number_of_entries
      );
    });
    it('Checking that response contains initial_amount key that is not undefined', () => {
      expect(configHelper.response.body.initial_amount).not.to.be.undefined;
    });
    it(`Checking that initial_amount key has value ${localHeper.testData.config.validConfig.initial_amount}`, () => {
      expect(configHelper.response.body.initial_amount).to.be.eq(
        localHeper.testData.config.validConfig.initial_amount
      );
    });
  });

  describe(`Editing all the configurations - unhappy path with invalid value of number_of_entries "${localHeper.testData.config.invalidConfigBigger.number_of_entries}" (bigger than limit) and valid initial_amount "${localHeper.testData.config.invalidConfigBigger.initial_amount}"`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method login
      await configHelper.editConfig(
        localHeper.testData.config.invalidConfigBigger.number_of_entries,
        localHeper.testData.config.invalidConfigBigger.initial_amount
      );
    });
    it(`Checking that response status code is "${localHeper.testData.config.responses.entityAreTooBig.statusCode}"`, () => {
      expect(configHelper.response.statusCode).to.eq(
        localHeper.testData.config.responses.entityAreTooBig.statusCode
      );
    });
    it(`Checking that response body has an error message "${localHeper.testData.config.responses.entityAreTooBig.message}"`, () => {
      expect(configHelper.response.body.message).to.eq(
        'Number of entries must be between 5 and 25 (inclusively).'
      );
    });
  });
  describe(`Editing all the configurations - unhappy path with invalid value of number_of_entries "${localHeper.testData.config.invalidConfigLess.number_of_entries}" (less than limit) and valid initial_amount "${localHeper.testData.config.invalidConfigLess.initial_amount}"`, () => {
    //BEFORE hook - will be runned 1st (before all other suits/tests)
    before(async () => {
      //Send async request using our HELPER method login
      await configHelper.editConfig(
        localHeper.testData.config.invalidConfigLess.number_of_entries,
        localHeper.testData.config.invalidConfigLess.initial_amount
      );
    });
    it(`Checking that response status code is "${localHeper.testData.config.responses.entityAreTooBig.statusCode}"`, () => {
      expect(configHelper.response.statusCode).to.eq(
        localHeper.testData.config.responses.entityAreTooBig.statusCode
      );
    });
    it(`Checking that response body has an error message "${localHeper.testData.config.responses.entityAreTooBig.message}"`, () => {
      expect(configHelper.response.body.message).to.eq(
        'Number of entries must be between 5 and 25 (inclusively).'
      );
    });
  });
});
