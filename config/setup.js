import 'dotenv/config';
import AuthHelper from '../helpers/auth.helper';
import ConfigHelper from '../helpers/config.helper';
before(async () => {
  const authHelper = new AuthHelper();
  await authHelper.login(process.env.LOGIN, process.env.PASSWORD);
  process.env['TOKEN'] = authHelper.response.body.token;
});

after(async () => {
  const configHelper = new ConfigHelper();
  await configHelper.wipeData();
});
