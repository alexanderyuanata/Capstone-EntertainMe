const { returnResponse, getBooksRecommendation, getBookDetail, getMoviesRecommended, getMovieDetail,  } = require('./handler')

const routes = [
  {
    path: '/check',
    method: 'GET',
    handler: returnResponse,
  },
  {
    path: '/recommend/books',
    method: 'GET',
    handler: getBooksRecommendation,
  },
  {
    path: '/books/detail',
    method: 'GET',
    handler: getBookDetail,
  },
  {
    path: '/recommend/movies',
    method: 'GET',
    handler: getMoviesRecommended,
  },
  {
    path: '/movies/detail',
    method: 'GET',
    handler: getMovieDetail,
  },
]

module.exports = routes;