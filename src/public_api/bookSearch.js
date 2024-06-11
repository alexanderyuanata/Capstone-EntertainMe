const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");
const { checkUid } = require ("../services/userService");
const { getFirstElement, customEncodeURIComponent } = require('../services/miscellaneousFunc');

require('dotenv').config();

//constants
const BOOK_LIMIT = 8;

const instance = axios.create({
  baseURL: process.env.BOOK_MODEL_URL || "http://localhost:5000",
  timeout: 1000,
});

//a function to search books from the database
async function searchBooks(inputData) {
  let titleDetails = [];

  //send a get request to the gateway API
  await instance
    .post(
      "/recommend", 
      inputData,
      {
      params: {
        key: process.env.BOOK_API_KEY,
      },
    })
    .then(async (response) => {
      //if the server doesn't return a successful query
      if (response.status != 200) {
        throw err;
      }

      //get the array of books that the public API returns
      let bookResult = response.data.recommendations;
      const leftover = BOOK_LIMIT - bookResult.length;
      

      if (leftover > 0){
        const filler = (await getRandomBooks()).slice(0, leftover);
        console.log("added some stuff");
        bookResult = bookResult.concat(filler);
      }

      //process data to get the cover and detail
      if (Array.isArray(bookResult)) {
        // Use map instead of forEach to return an array of promises
        const promises = bookResult.map(async (title) => {
          const detail = await getBook(title.Book);

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

async function getRandomBooks(){
  let titleDetails = [];

  //send a get request to the gateway API
  await instance
    .post(
      "/recommend", 
      {
        text:" "
      },
      {
      params: {
        key: process.env.BOOK_API_KEY,
      },
    })
    .then(async (response) => {
      //if the server doesn't return a successful query
      if (response.status != 200) {
        throw err;
      }

      //get the array of books that the public API returns
      const bookResult = response.data.recommendations;

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

module.exports = { searchBooks, getBook };
