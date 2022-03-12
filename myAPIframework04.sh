#!/bin/bash
#v0.3 - fixed name separation and test script
#22/02/2022
# Color variables
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
blue='\033[0;34m'
magenta='\033[0;35m'
cyan='\033[0;36m'
# Clear the color after that
clear='\033[0m'

#VARIABLES
gitHubLink=$1

sudo echo
echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"
echo -e "${magenta}+${yellow}  Hi there! This is my bash script for creating API test automation framework  ${magenta}+${clear}"
echo -e "${magenta}+${red}       (babel, supertest, chai, mocha, dotenv, express, body-parser)           ${magenta}+${clear}"
echo -e "${magenta}+${green}               from scratch with only 1 terminal command!                      ${magenta}+${clear}"
echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"
echo
echo -e "                           ${cyan}LET's get STARTED ! ! !${clear}"
echo
if [ -z "$gitHubLink" ]
then
  echo -e "${red}You forgot to provide a link to your repository!" && exit 1
fi

#Separate project name from gitHub link
cutted=${gitHubLink##*/}
length=${#cutted}
projectName=${cutted:0:length-4}

echo
echo 
echo -e "${green}Step 0${clear} - Right now your terminal is in: ${yellow}$(pwd)${clear}"
echo
echo -e "${green}Step 1${clear} - Your project is: ${yellow}$projectName${clear}"
echo
echo -e "${green}Step 2${clear} - Checking if there is a ${yellow}$projectName${clear} in ${yellow}$(pwd)${clear}"
echo
if [ -d $(pwd)"/"$projectName ]
then
echo "  Folder $projectName exists in $(pwd) - I am going to delete it!"
echo $(rm -rf $projectName)

    if [ -d $(pwd)"/$projectName" ]
    then
    echo "  CAN'T DELETE $projectName in $(pwd)!" && exit
    else
    echo "  Folder $projectName was deleted from $(pwd)!"
    fi
else
echo "  Folder $projectName doesn't exist in $(pwd) - ALL OK!"
fi
echo
echo -e "${green}Step 3${clear} - Clonning your empty repository"
echo
echo $(git clone $1)

 if [ -d $(pwd)"/"$projectName ]
    then
    echo -e "  ${green}Your project was clonned!${clear}"
    
    else
    echo -e "  ${red}ERROR!${clear}"
    fi
echo 
echo -e "${green}Step 4${clear} - Creating a new NMP project with default values (npm init -y)"
cd $projectName 
echo $(npm init -y)
if [ -f 'package.json' ] 
then
    echo -e    "   ${green}Project was created!${clear}"
else
    echo -e "  ${red}ERROR!${clear}"
fi
echo 
echo -e "${green}Step 5${clear} - Installing all the 3rd party packages: babel, mocha, chai, supertest, dotenv, express, body-parser"
echo $(npm i -D @babel/cli @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/register mocha chai supertest dotenv express body-parser )
echo
echo -e "${green}Step 6${clear} - Setting up babel"
echo '
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
}
' >> .babelrc
echo -e "   ${green}New .babelrc is${clear}"
cat .babelrc

echo 
echo -e "${green}Step 7${clear} - Setting up mocha"
echo "module.exports = {
    //Import babel to the project
  require: '@babel/register',
    //Setup all the specs that will be runned
  spec: 'specs/**/*.spec.js',
    //Setup configuretion file - MAIN HOOKS
  file: 'config/setup.js',
    //Setup all the specs that will be ignored
  //ignore: 'specs/example.spec',
    //Setup additionall timeout (2000 by default)
  //timeout: 10000
}" >> .mocharc.js
echo -e "   ${green}New .mocharc.js is${clear}"
cat .mocharc.js


echo 
echo -e "${green}Step 8${clear} - Setting up main config file"
mkdir config
touch config/setup.js
echo "
//IMPORT SECTION
//  Import dotenv package - to work with environmental project's variables
import 'dotenv/config';
//  Import Helper(s)
import AuthHelper from '../helpers/auth.helper';
//  Create a new instanse of helper
const authHelper = new AuthHelper();
//MAIN MOCHA HOOKS
//  Before - will be runned before all the tests - MAIN PRECONDITIONS
before(async () => {
  //Create a new user / login / save a token to variable etc
    await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
    process.env.TOKEN = authHelper.response.body.token;
});
//  After - will be runned after all the tests - MAIN POSTCONDITIONS
after(async () => {
  //Clear all the test changes
});
" >> config/setup.js
echo -e "   ${green}New setup.js is${clear}"
cat config/setup.js

echo 
echo -e "${green}Step 9${clear} - Fixing npm script TEST"
text=$(cat package.json)
target=`echo \"Error: no test specified\" && exit 1`
new='npx mocha --config .mocharc.js'
final=${text//'echo \"Error: no test specified\" && exit 1'/"npx mocha --config .mocharc.js"}
$(echo $final > package.json)
echo -e "   ${green}New package.json is${clear}"
cat package.json

echo 
echo -e "${green}Step 10${clear} - Creating first tests"
mkdir specs helpers 
touch specs/auth.spec.js helpers/auth.helper.js 


echo "
//IMPORT SECTION
//  Import supertest - HTTP Client that allows us to create and send a request from a test framework to server
import supertest from 'supertest';
//  Import dotenv package - to work with environmental project's variables
import 'dotenv/config';
    //Create a new Class for authHelper - will store response from a server in response property (variable) all the methods (functions) that related to auth
class AuthHelper {
  constructor() {
    this.response = null;
  }
    //Create a new method
  async login(userName, userPassword) {
    //Create, setup, send request to server, wait for the response (async/await) and save the respponse from server to response property (variable)
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .post('/auth')
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ login: userName, password: userPassword })
      //Save a response from server to esponse property (variable)
      .then((res) => {
        this.response = res;
      });
  }
}
    //Export the Class
export default AuthHelper;
" >> helpers/auth.helper.js
echo -e "   ${green}New helpers/auth.helper.js is${clear}"
cat helpers/auth.helper.js


echo "
//IMPORT SECTION
//  Import {expect} assertion function from Chai assertion library
import { expect } from 'chai';
//  Import helper(s)
import AuthHelper from '../helpers/auth.helper';
//  Creating a new instance of helper(s)
const authHelper = new AuthHelper();
//  Main Test Suite
describe('\nSuccessful login sub suite (happy path with valid login and password)', () => {
    //BEFORE hook
  before(async () => {
    await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
  });
    //Test Cases
  it('Checking that response status code is 200', () => {
    expect(authHelper.response.statusCode).to.eq(200);
  });
  it('Checking that response contains TOKEN key that is not undefined', () => {
    expect(authHelper.response.body.token).not.to.be.undefined;
  });
  it('Checking that response contains TOKEN key with value that is 36 symbols in length', () => {
    expect(authHelper.response.body.token.length).to.be.eq(36);
  });
});

" >> specs/auth.spec.js
echo -e "   ${green}New helpers/auth.helper.js is${clear}"
cat specs/auth.spec.js




echo 
echo -e "${green}Step 11${clear} - Setting up environmental variables (.env and .env.example)!"

touch .env .env.example


echo '
BASE_URL="ENTER-URL-OF-YOUR-PROJECT"
LOGIN="ENTER-ADMIN-LOGIN"
PASSWORD="ENTER-ADMIN-PASSWORD"
' >> .env


echo '
BASE_URL="https://paysis.herokuapp.com"
LOGIN="trulala"
PASSWORD="tralala"
' >> .env.example

echo 
echo -e "${green}Step 12${clear} - RUN the TESTS!"
echo $(npm run test)

echo 
echo -e "${green}Step 13 - IT'S TIME TO PUSH ALL THE CHANGES TO YOUR GITHUB REPO! ${clear}"
echo $(git status)
echo $(git add .)
echo $(git status)
echo $(git commit -m 'Test automation framework' -m 'Everything is ready to TEST!')
echo $(git push)

echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"
echo -e "${magenta}+${yellow}    It seems to me that your NEW TESTAUTOMATION FRAMEWORK IS READY TO WORK     ${magenta}+${clear}"
echo -e "${magenta}+${red}              YOU JUST NEED TO START WRITING YOUR TEST CASES                   ${magenta}+${clear}"
echo -e "${magenta}+${green}                             HAVE A GREAT TEST!                                ${magenta}+${clear}"
echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"
