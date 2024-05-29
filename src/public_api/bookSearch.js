const axios = require('axios');

function searchBooks(query_title){
  axios.get("https://openlibrary.org/search.json", { 
    params: {
      title: query_title
    }
   })
   .then((response) => {
      console.log(response.data);
   })
   .catch((error) => {
      console.log(error);
   })
   .finally(() => {
      console.log('request end');
   });
}

module.exports = searchBooks;
