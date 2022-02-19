import common from 'mocha/lib/interfaces/common';
import supertest from 'supertest';
import CommonHelper from '../helpers/common.helper';
const commonHelper = new CommonHelper();
class ConfigHelper {
  constructor() {
    this.response = null;
  }
  //Get config
  async getConfig() {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - GET and an endpoint - /config
      .get('/config')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  //Edit config
  async editConfig(ent, amo) {
    //Send async request
    await supertest(process.env.BASE_URL)
      //Setup a request method - GET and an endpoint - /config
      .patch('/config')
      //Add token to uou request (for each protected route)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      //Setup payload - object with 2 keys - login and password (and their values)
      .send({ number_of_entries: ent, initial_amount: amo })
      //Save a response from server to result variable
      .then((res) => {
        this.response = res;
      });
  }

  //WIPE all the DATA
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
        commonHelper.wipeLocalDB();
      });
  }
}
export default ConfigHelper;
