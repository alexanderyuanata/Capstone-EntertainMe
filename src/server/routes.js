const { returnResponse, getBooksRecommendation, getBookDetail, getMoviesRecommended, getMovieDetail, performQuery, getTravelRecommendation, getStressPrediction,  } = require('./handler')

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
    path: '/recommend/movies',
    method: 'GET',
    handler: getMoviesRecommended,
  },
  {
    path: '/movies/detail',
    method: 'GET',
    handler: getMovieDetail,
  },
  {
    path: '/query',
    method: 'GET',
    handler: performQuery,
  },
  {
    path: '/recommend/travel',
    method: 'GET',
    handler: getTravelRecommendation,
  },
  {
    path: '/predict/stress',
    method: 'GET',
    handler: getStressPrediction,
  }
]

module.exports = routes;