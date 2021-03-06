import supertest from 'supertest';
import 'dotenv/config';

class AuthHelper {
  constructor() {
    this.response = null;
  }

  async login(adminName, adminPassword) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .post('/auth')
      //Setup payload - object with 2 keys
      .send({ login: adminName, password: adminPassword })
      //Save a response from server in response variable
      .then((res) => {
        this.response = res;
      });
  }
}

export default AuthHelper;
