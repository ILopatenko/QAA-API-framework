#!/bin/bash
# Color variables
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
blue='\033[0;34m'
magenta='\033[0;35m'
cyan='\033[0;36m'
# Clear the color after that
clear='\033[0m'



echo My test script
read -p "PROJECT NAME: " projectName
sudo mkdir $projectName
if [ -d $(pwd)"/"$projectName ]
then
echo -e "Local directory was created successfully!"
else
echo -e "ERROR!"
fi
cd $projectName
git init
npm init -y
npm i -D mocha chai supertest dotenv

text=$(cat package.json)
target=`echo \"Error: no test specified\" && exit 1`
new='npx mocha --config .mocharc.js'
final=${text//'echo \"Error: no test specified\" && exit 1'/"npx mocha --config .mocharc.js"}
$(echo $final > package.json)
mkdir specs helpers 
touch specs/countries.spec.js helpers/countries.helper.js setup.js

echo "module.exports = {
    //Setup all the specs that will be runned
  spec: './specs/**/*.spec.js',
    //Setup configuretion file - MAIN HOOKS
  file: './setup.js',
    //Setup all the specs that will be ignored
  ignore: './specs/example.spec',
    //Setup additionall timeout (2000 by default)
  timeout: 5000
}" >> .mocharc.js


echo "
require('dotenv').config()
" >> setup.js


echo "
//IMPORT SECTION
//  Import supertest - HTTP Client that allows us to create and send a request from a test framework to server
const supertest = require('supertest');
//Create a new Class for authHelper - will store response from a server in response property (variable) all the methods (functions) that related to auth
class CountriesHelper {
  constructor() {
    this.response = null;
  }
  //Create a new method
  async getAllTheCountries() {
    //Create, setup, send request to server, wait for the response (async/await) and save the respponse from server to response property (variable)
    await supertest(process.env.BASE_URL)
      //Setup a request method - GET and an endpoint - /country_codes
      .get('/country_codes')
      //Save a response from server to esponse property (variable)
      .then((res) => {
        this.response = res;
      });
  }
}
//Export the Class
module.exports = CountriesHelper;
" >> helpers/countries.helper.js


echo "
//IMPORT SECTION
//  Import {expect} assertion function from Chai assertion library
const expect = require('chai').expect;
//  Import helper(s)
const CountriesHelper = require('../helpers/countries.helper');
//  Creating a new instance of helper(s)
const countriesHelper = new CountriesHelper();
//  Main Test Suite
describe('\nGettin all the countries codes', () => {
  //BEFORE hook
  before(async () => {
    await countriesHelper.getAllTheCountries();
    response = countriesHelper.response;
  });
  //Test Cases
  it('Checking that response status code is 200', () => {
    expect(countriesHelper.response.statusCode).to.eq(200);
  });
  it('Checking that response body is an array', () => {
    expect(countriesHelper.response.body).to.be.an('array');
  });
  it('Checking that response body is an array with length at least 60', () => {
    expect(countriesHelper.response.body.length).to.be.at.least(60);
  });
  it('Checking each element', () => {
    for (let country of countriesHelper.response.body) {
      expect(country).to.be.a('string');
      expect(country.length).to.eq(2);
      expect(country).to.eq(country.toUpperCase());
    }
  });
});
" >> specs/countries.spec.js

touch .env .env.example

echo "
BASE_URL="https://sre-test-api.herokuapp.com/"
" >> .env

echo "
BASE_URL="https://sre-test-api.herokuapp.com/"
" >> .env.example

