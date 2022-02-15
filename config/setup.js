import 'dotenv/config';
import supertest from 'supertest';

before(async () => {
  //Create a request object
  const request = await supertest(process.env.BASE_URL);
  await request
    //Setup a request method - POST and an endpoint - /auth
    .post('/auth')
    //Setup payload - object with 2 keys - login and password (and their values)
    .send({ login: process.env.LOGIN, password: process.env.PASSWORD })
    //Save a response from server to result variable
    .then((res) => {
      process.env['TOKEN'] = res.body.token;
    });
});
