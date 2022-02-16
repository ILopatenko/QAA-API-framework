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
