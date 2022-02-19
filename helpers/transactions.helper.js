import supertest from 'supertest';
import 'dotenv/config';
class TransactionsHelper {
  constructor() {
    this.response = null;
  }

  async create(userID1, userID2, amount) {
    await supertest(process.env.BASE_URL)
      .post('/transactions')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({ from: userID1, to: userID2, amount: amount })
      .then((res) => {
        this.response = res;
      });
  }

  async getAll() {
    await supertest(process.env.BASE_URL)
      .get('/transactions')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        this.response = res;
      });
  }

  async getByID(id) {
    await supertest(process.env.BASE_URL)
      .get(`/transactions?id=${id}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .then((res) => {
        this.response = res;
      });
  }
}

export default TransactionsHelper;
