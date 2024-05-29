const { searchBooks, getBook } = require("../public_api/bookSearch");

function returnResponse(request, h){
  const response = h.response({
    status: 'success',
    message: 'this is a response',
  })
  response.code(200);

  return response;
}

async function getRandomBooks(request, h){
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

module.exports = { returnResponse, getRandomBooks, getBookDetail };