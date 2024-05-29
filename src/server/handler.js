const searchBooks = require("../public_api/bookSearch");


function returnResponse(request, h){
  const response = h.response({
    status: 'success',
    message: 'this is a response',
  })
  response.code(200);

  return response;
}

function testHandler(request, h){
  searchBooks("three body problem");

  const response = h.response({
    status: 'success',
    message: 'successfully sent an API call to open library',
  })
  response.code(200);

  return response;
}

module.exports = { returnResponse, testHandler };