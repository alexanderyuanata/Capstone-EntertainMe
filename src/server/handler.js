function returnResponse(request, h){
  const response = h.response({
    status: 'success',
    message: 'this is a response',
  })
  response.code(200);

  return response;
}

module.exports = { returnResponse };