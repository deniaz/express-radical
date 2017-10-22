const http = require('http-status-codes');

const handleRequest = async (request, response) => {
  return response.status(http.IM_A_TEAPOT).send('create-user');
};

module.exports = {
  route: '/users',
  method: 'post',
  handler: handleRequest,
}
