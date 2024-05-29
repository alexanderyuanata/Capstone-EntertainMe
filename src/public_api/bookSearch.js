const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");

//constants
const BOOK_QUERY_LIMIT = 10;

//function to check if parameter is an array and return the first element if so
function getFirstElement(data) {
  return Array.isArray(data) ? data[0] : data;
}

//a function to search books from the OpenLibrary API
async function searchBooks(query) {
  let bookList = [];

  await axios
    .get("https://openlibrary.org/search.json", {
      params: {
        q: query.subject,
        sort: "rating",
        language: "eng",
        fields: "key,title,cover_i,first_sentence,author_name,publish_year",
        limit: BOOK_QUERY_LIMIT,
      },
    })
    .then((response) => {
      //get the array of books that the public API returns
      const bookResult = response.data.docs;

      //create a new array by filtering only the necessary info and assembling a cover URL
      bookResult.forEach((book) => {
        bookList.push({
          title: book.title,
          author: getFirstElement(book.author_name),
          cover_url: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
          publish_year: getFirstElement(book.publish_year),
          first_sentence: getFirstElement(book.first_sentence),
          key: book.key,
        });
      });

    })
    .catch((error) => {
      handleAxiosGetError(error);
    })
    .finally(() => {
      //do something when everything is done
    });
   
    //return fetched data
    return bookList;
}

async function getBook(key) {
   //get the book from open library
   let details = {};
  await axios
    .get(`https://openlibrary.org${key}.json`)
    .then((response) => {
      //get the description
      details.description = response.data.description;
    })
    .catch((error) => {
      handleAxiosGetError(error);
    })
    .finally(() => {
      console.log("-------------------request end----------------------");
    });

    return details;
}

module.exports = { searchBooks, getBook };
