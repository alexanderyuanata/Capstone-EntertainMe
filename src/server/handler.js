const { searchBooks, getBook, doQuery } = require("../public_api/bookSearch");
const { searchMovies, searchMovieDetail } = require("../public_api/movieSearch");

function returnResponse(request, h){
  const response = h.response({
    status: 'success',
    message: 'this is a response',
  })
  response.code(200);

  return response;
}

async function getBooksRecommendation(request, h){
  let books = await searchBooks({
    subject: 'sci+fi',
  });

  console.log(books);

  const response = h.response({
    status: 'success',
    message: 'successfully sent an API call to open library',
    data: books,
  })
  response.code(200);

  return response;
}

async function getBookDetail(request, h){
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null){
    const response = h.response({
      status: 'failure',
      message: 'no book key detected',
    })
    response.code(400);

    return response;
  }

  const detail = await getBook(key);
  const response = h.response({
    status: 'success',
    message: 'got synopsis of book',
    synopsis: detail,
  })
  response.code(200);

  return response;
}

async function getMoviesRecommended(request, h){
  let movies = await searchMovies("spider-man");

  console.log('received movie data here');

  const response = h.response({
    status: 'success',
    message: 'successfully sent an API call to open movie database',
    data: movies,
  })
  response.code(200);

  return response;
}

async function getMovieDetail(request, h){
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null){
    const response = h.response({
      status: 'failure',
      message: 'no movie key detected',
    })
    response.code(400);

    return response;
  }

  const detail = await searchMovieDetail(key);
  const response = h.response({
    status: 'success',
    message: 'got detail of movie',
    detail: detail,
  })
  response.code(200);

  return response;
}

async function performQuery(request, h){
  let content = await doQuery();
  const response = h.response({
    status: 'success',
    message: 'contacted cloud run API',
    data: content,
  })
  response.code(200);
}

module.exports = { returnResponse, getBooksRecommendation, getBookDetail, getMoviesRecommended, getMovieDetail, performQuery };