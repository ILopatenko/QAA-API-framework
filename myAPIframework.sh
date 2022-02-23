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
if [ -d $(pwd)"/$projectName" ]
then
echo "  Folder $projectName exists in $(pwd) - I am going to delete it!"
rm -dr $projectName
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
 if [ -d $(pwd)"/$projectName" ]
    then
    echo -e "  ${green}Your progect was clonned!${clear}"
    else
    echo -e "  ${red}ERROR!${clear}"
    fi
echo 
echo -e "${green}Step 4${clear} - Creating a new NMP project with default values (npm init -y)"
cd $projectName && npm init -y
if [ -f 'package.json' ] 
then
    echo -e    "   ${green}Progect was created!${clear}"
else
    echo -e "  ${red}ERROR!${clear}"
fi
echo 
echo -e "${green}Step 5${clear} - Installing all the 3rd party packages: babel, mocha, chai, supertest, dotenv, express, body-parser"
npm i -D @babel/cli @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/register mocha chai supertest dotenv express body-parser json
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
  require: '@babel/register',
  spec: 'specs/**/*.spec.js',
}" >> .mocharc.js
echo -e "   ${green}New .mocharc.js is${clear}"
cat .mocharc.js
echo 
echo -e "${green}Step 8${clear} - Fixing npm script TEST"

json --in-place -f package.json -e 'this.scripts={"test": "npx mocha --confug .mocharc.js"}'
echo -e "   ${green}New package.json is${clear}"
cat package.json

echo 
echo -e "${green}Step 10${clear} - Creating first tests"
mkdir specs helpers
touch specs/auth.spec.js helpers/auth.helper.js


echo "
import supertest from 'supertest';
import 'dotenv/config';
class AuthHelper {
  constructor() {
    this.response = null;
  }

  async login(userName, userPassword) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .post('/auth')
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ login: userName, password: userPassword })
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }
}

export default AuthHelper;
" >> helpers/auth.helper.js
echo -e "   ${green}New helpers/auth.helper.js is${clear}"
cat helpers/auth.helper.js


echo "
import { expect } from 'chai';
import AuthHelper from '../helpers/auth.helper';
const authHelper = new AuthHelper();
describe('\nSuccessful login sub suite (happy path with valid login and password)', () => {
  before(async () => {
    await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
  });
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

touch .env .env.example


echo '
BASE_URL="https://paysis.herokuapp.com"
LOGIN="adminius"
PASSWORD="supers3cret"
' >> .env


echo '
BASE_URL="https://paysis.herokuapp.com"
LOGIN="trulala"
PASSWORD="tralala"
' >> .env.example

echo 
echo -e "${green}Step 11${clear} - RUN the TESTS!"
echo $(npm run test)

echo 
echo -e "${green}Step 12$ - IT'S TIME TO PUSH ALL THE CHANGES TO YOUR GITHUB REPO! ${clear}"
#echo $(git status)
#echo $(git add .)
#echo $(git status)
#echo $(git commit -m 'Test automation framework' -m 'Everything is ready to TEST!')
#echo $(git push)

echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"
echo -e "${magenta}+${yellow}    It seems to me that your NEW TESTAUTOMATION FRAMEWORK IS READY TO WORK     ${magenta}+${clear}"
echo -e "${magenta}+${red}              YOU JUST NEED TO START WRITING YOUR TEST CASES                   ${magenta}+${clear}"
echo -e "${magenta}+${green}                             HAVE A GREAT TEST!                                ${magenta}+${clear}"
echo -e "${magenta}+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++${clear}"



