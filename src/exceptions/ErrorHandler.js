function handleAxiosGetError(error){
  console.log('-----------------request error--------------------------');

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response);
  } else if (error.request) {
    console.log(error.request.message);
  } else {
    console.log("Error: ", error.message);
  }
  console.log(error.config);
}

module.exports = { handleAxiosGetError };