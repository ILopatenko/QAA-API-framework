import supertest from 'supertest';
import 'dotenv/config';
class TransactionsHelper {
  constructor() {
    this.response = null;
  }

  async create(userID1, userID2, amount) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .post('/transactions')

      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ from: userID1, to: userID2, amount: amount })
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  async getAll() {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .get('/transactions')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  async getByID(id) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .get(`/transactions?id=${id}`)
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }
}

export default TransactionsHelper;
