const { searchBooks, getBook } = require("../public_api/bookSearch");
const doQuery = require("../public_api/databaseGateway");
const {
  searchMovies,
  searchMovieDetail,
} = require("../public_api/movieSearch");
const axios = require("axios");

function returnResponse(request, h) {
  const response = h.response({
    status: "success",
    message: "this is a response",
  });
  response.code(200);

  return response;
}

//handler to get book recommendation of a specific user
async function getBooksRecommendation(request, h) {
  //get the uid from query parameters
  const uid = request.query.uid;

  //if there's no uid passed in, then return a failure
  if (uid == undefined){
    const response = h.response({
      status: "failure",
      message: "no uid in query parameters, cannot fetch recommendation data",
    });
    response.code(400);
    return response;
  }

  //TODO: write code that fetches data from the firebase database and pass it to searchBooks
  //const userBookPreference = TODO FUNCTION HERE(uid);

  //replace the variable below after todo is done, recommendedBooks is an ARRAY that holds strings consists of titles that we recommend
  //the array should be limited to 10 books at maximum
  //write a function that takes userBookPreference and returns an array to assign to recommendedBooks, this uses the deployed ML model
  const recommendedBooks = []//write ML function here;

  //try to get a response from the gateway API
  try {
    //wait for the details of each book
    let books = await searchBooks(recommendedBooks);

    const response = h.response({
      status: "success",
      message: "returned a list of book recommendations",
      title_count: books.length,
      titles: books,
    });
    response.code(200);

    return response;
  } catch (error) {
    const response = h.response({
      status: "failure",
      message: "something went wrong when getting the recommendations",
      error_msg: error.message,
    });
    response.code(500);

    return response;
  }
}

async function getBookDetail(request, h) {
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null) {
    const response = h.response({
      status: "failure",
      message: "no book key detected",
    });
    response.code(400);

    return response;
  }

  const detail = await getBook(key);
  const response = h.response({
    status: "success",
    message: "got synopsis of book",
    synopsis: detail,
  });
  response.code(200);

  return response;
}

async function getMoviesRecommended(request, h) {
  let movies = await searchMovies("spider-man");

  console.log("received movie data here");

  const response = h.response({
    status: "success",
    message: "successfully sent an API call to open movie database",
    data: movies,
  });
  response.code(200);

  return response;
}

async function getMovieDetail(request, h) {
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null) {
    const response = h.response({
      status: "failure",
      message: "no movie key detected",
    });
    response.code(400);

    return response;
  }

  const detail = await searchMovieDetail(key);
  const response = h.response({
    status: "success",
    message: "got detail of movie",
    detail: detail,
  });
  response.code(200);

  return response;
}

async function performQuery(request, h) {
  let content = await doQuery();

  //if we failed to fetch any query data
  if (content == undefined) {
    const response = h.response({
      status: "failure",
      message: "failed to contact database API",
    });
    response.code(500);

    return response;
  }

  const response = h.response({
    status: "success",
    message: "contacted database gateway",
    data: content,
  });
  response.code(200);

  return response;
}

module.exports = {
  returnResponse,
  getBooksRecommendation,
  getBookDetail,
  getMoviesRecommended,
  getMovieDetail,
  performQuery,
};
