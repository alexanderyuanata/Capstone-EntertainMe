const { returnResponse, testHandler } = require('./handler')

const routes = [
  {
    path: '/',
    method: 'GET',
    handler: returnResponse,
  },
  {
    path: '/test',
    method: 'GET',
    handler: testHandler,
  },
]

module.exports = routes;