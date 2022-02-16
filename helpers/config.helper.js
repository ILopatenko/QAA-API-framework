import supertest from 'supertest';

class ConfigHelper {
  constructor() {
    this.response = null;
  }
  //Create a new USER
  async wipeData() {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - POST and an endpoint - /auth
      .delete('/config')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }
}
export default ConfigHelper;
