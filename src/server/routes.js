const { returnResponse } = require('./handler')

const routes = [
  {
    path: '/',
    method: 'GET',
    handler: returnResponse,
  },
]

module.exports = routes;