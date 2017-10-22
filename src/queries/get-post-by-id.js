const status = require('http-status-codes');

const Post = require('../entities/post');

const handleRequest = async (request, response) => {
  const post = await Post.findById(request.params.id);

  if (post) {
    return response.status(status.OK).send(post);
  }

  return respones.sendStatus(status.NOT_FOUND);
};

module.exports = {
  route: '/users/:id',
  method: 'get',
  handler: handleRequest,
}
