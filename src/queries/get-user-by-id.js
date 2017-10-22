const http = require('http-status-codes');

const handleRequest = async (request, response) => {
  return response.status(http.IM_A_TEAPOT).send('get-user-by-id');
};

module.exports = {
  route: '/users/:id',
  method: 'get',
  handler: handleRequest,
}
