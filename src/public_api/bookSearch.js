const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");

//constants
const BOOK_QUERY_LIMIT = 8;

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

          if (detail == undefined) {
            title.cover_url = undefined;
            title.publish_year = undefined;
            console.log("no detail found, none assigned");
            return;
          }

          title.cover_url = detail.coverUrl;
          title.publish_year = detail.year;
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
  //get the book from open library
  const encodedTitle = customEncodeURIComponent(title);
  console.log(encodedTitle);
  let details = {};

  await axios
    .get("https://openlibrary.org/search.json", {
      params: {
        title: encodedTitle,
        limit: 1,
        fields: "cover_i, publish_year",
        lang: "eng",
      },
      //timeout: 1000, timeout is broken DO NOT USE
    })
    .then((response) => {
      //get the cover id and the publishing year
      console.log(response.data.docs);

      const cover_id = getFirstElement(response.data.docs).cover_i;
      const year = getFirstElement(response.data.docs).publish_year;

      //assign if we got something
      if (cover_id != undefined) {
        details.coverUrl = `https://covers.openlibrary.org/b/id/${cover_id}-M.jpg`;
      }

      if (year != undefined) {
        details.year = getFirstElement(getFirstElement(year));
      }
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
