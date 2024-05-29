const { returnResponse, getRandomBooks, getBookDetail } = require('./handler')

const routes = [
  {
    path: '/check',
    method: 'GET',
    handler: returnResponse,
  },
  {
    path: '/recommend/books',
    method: 'GET',
    handler: getRandomBooks,
  },
  {
    path: '/books/detail',
    method: 'GET',
    handler: getBookDetail,
  },
]

module.exports = routes;