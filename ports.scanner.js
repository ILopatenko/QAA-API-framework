const axios = require('axios');

const baseUrl = 'http://192.168.0.100';
const endpoint = '';
const result = [];
const sendGetRequest = async (baseUrl, port, endpoint) => {
  try {
    const resp = await axios.get(`${baseUrl}:${port}${endpoint}`);
    //console.log('resp');
    //console.log(resp);
  } catch (err) {
    if (err.response === undefined) {
      console.log(`${baseUrl}:${port}${endpoint} doesn't exists`);
    } else {
      result.push({
        baseUrl,
        port,
        endpoint,
        method: 'GET',
        result: {
          statusCode: err.response.status,
          statusMessage: err.response.statusText,
        },
        fullResponse: err,
      });
    }
  }
};
const checker = async (baseUrl, maxPort, endpoint) => {
  for (let i = 0; i < maxPort; i++) {
    await sendGetRequest(baseUrl, i, endpoint);
  }
  console.log('\n\n\nFinal result is ', result);
  return result;
};
let aaa = checker(baseUrl, 10000, endpoint);

console.log(aaa);
