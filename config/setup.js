import 'dotenv/config';
import AuthHelper from '../helpers/auth.helper';
import ConfigHelper from '../helpers/config.helper';
const authHelper = new AuthHelper();
const configHelper = new ConfigHelper();
before(async () => {
  await configHelper.wipeData();
  console.log('setup action ACCDTION: Data wiped (server)');
  await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
  process.env.VARIABLE = 'TRALALALALA';
  console.log('variable is', process.env.VARIABLE);
  console.log('HEYHEY is', process.env.HEYHEY);
  process.env.TOKEN = authHelper.response.body.token;
});

after(async () => {
  await configHelper.wipeData();
  console.log('ACTION: Data wiped (server)');
});
