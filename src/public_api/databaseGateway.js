const axios = require('axios');
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");

async function doQuery(){
  let message;

  await axios
    .get(`https://gateway-api-4nqq6tztla-et.a.run.app/`)
    .then((response) => {
      //get the description
      message = response;
    })
    .catch((error) => {
      handleAxiosGetError(error);
    })
    .finally(() => {
      console.log("-------------------request end----------------------");
    });
  
  return message;
}

module.exports = doQuery;