const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");

require('dotenv').config();

//constants
const BOOK_QUERY_LIMIT = 1;

const instance = axios.create({
  baseURL: process.env.GATEWAY_URL || "http://localhost:10600",
  timeout: 1000,
});

//function to check if parameter is an array and return the first element if so
function getFirstElement(data) {
  if (data == undefined) return undefined;

  return Array.isArray(data) ? data[0] : data;
}

//function for better encoding URI components
function customEncodeURIComponent(str) {
  // Replace all non-alphanumeric characters except spaces with an empty string
  let cleanedStr = str.replace(/[^a-zA-Z0-9 ]/g, "");
  // Replace spaces with '+'
  return cleanedStr.replace(/ /g, "+");
}

//a function to search books from the database
async function searchBooks(recommendedTitles) {
  let titleDetails = [];

  //for testing only, should be replace with recommendedTitles when model is ready
  const testTitles = ["Harry Potter", "Narnia", "Hunger Games"];

  //assemble a query param with identical keys
  // var titleArray = new URLSearchParams();
  // testTitles.forEach(title => {
  //   titleArray.append('title', `${title}`);
  // });

  //send a get request to the gateway API
  await instance
    .get("/query/books", {
      params: {
        title: testTitles,
      },
    })
    .then(async (response) => {
      //if the server doesn't return a successful query
      if (response.status != 200) {
        throw err;
      }

      //get the array of books that the public API returns
      const bookResult = response.data.titles;

      //process data to get the cover and detail
      if (Array.isArray(bookResult)) {
        // Use map instead of forEach to return an array of promises
        const promises = bookResult.map(async (title) => {
          const detail = await getBook(title.book);
          console.log('detail of ' + title.book + ': ' + detail);

          if (detail == undefined) {
            title.coverUrl = undefined;
            title.publishYear = undefined;
            title.infoUrl = undefined;
            console.log("no detail found, none assigned");
            return;
          }

          title.coverUrl = detail.coverUrl;
          title.publishYear = detail.publishYear;
          title.infoUrl = detail.infoUrl;
        });

        // Wait for all promises to resolve before proceeding
        await Promise.all(promises);
      }

      //assign processed data
      titleDetails = bookResult;
    })
    .catch((error) => {
      handleAxiosGetError(error);
    })
    .finally(() => {
      //do something when everything is done
    });

  //return fetched data
  return titleDetails;
}

async function getBook(title) {
  //encode the title to a safe format
  //all spaces are replaced with +, and all special characters are replaced
  const encodedTitle = customEncodeURIComponent(title);
  console.log('> ' + encodedTitle);

  let details = {};

  //send a call to the google API
  await axios
    .get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: `intitle:${encodedTitle}`,
        maxResults: 1,
        fields: 'items(volumeInfo/infoLink,volumeInfo/publishedDate,volumeInfo/imageLinks/thumbnail)',
        //langRestrict: "en", //for some reason this sometimes makes the search more restrictive
        key: process.env.GOOGLE_BOOKS_KEY,
      },
      //timeout: 1000, timeout is broken DO NOT USE
    })
    .then((response) => {
      //extract data from the response
      const bookData = getFirstElement(response.data.items).volumeInfo;

      //extract fields
      const info_link = bookData?.infoLink ?? 'NO_LINK';
      const cover_link = bookData?.imageLinks?.thumbnail ?? 'https://books.google.co.id/googlebooks/images/no_cover_thumb.gif';
      const year = bookData?.publishedDate ?? 'NO_DATE';

      //assign if we got something
      if (cover_link != undefined) {
        details.coverUrl = cover_link;
      }

      if (year != undefined) {
        details.publishYear = year;
      }

      if (info_link != undefined){
        details.infoUrl = info_link;
      }
    })
    .catch((error) => {
      console.log('error in getting book detail');
      handleAxiosGetError(error);
    })
    .finally(() => {
      
    });

    return details;
}

module.exports = { searchBooks, getBook };
