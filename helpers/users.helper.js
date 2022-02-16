import supertest from 'supertest';

class UsersHelper {
  constructor() {
    this.response = null;
  }
  //Create a new USER
  async createNew() {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .post('/users')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  //Get USER by ID
  async getByID(id) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .get(`/users?id=${id}`)
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  //Get all the USERS
  async getAll() {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .get('/users')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  //Delete USER by ID
  async deleteByID(id) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .delete(`/users`)
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Add payload to request
      .send({ id: id })
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }
}
export default UsersHelper;
