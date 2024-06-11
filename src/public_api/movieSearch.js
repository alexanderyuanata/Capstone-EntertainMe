const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");
const { customEncodeURIComponent, deleteField, deleteObjectField } = require("../services/miscellaneousFunc");

require('dotenv').config();

//constants
const instance = axios.create({
  baseURL: process.env.MOVIE_MODEL_URL || "http://localhost:5000",
  timeout: 1000,
});

async function searchMovies(inputData){
  let movieTitles = [];
  console.log(inputData);

  //send a get request to the gateway API
  await instance
    .post(
      "/recommend", 
      inputData,
      {
      params: {
        key: process.env.MOVIE_API_KEY,
      },
    })
    .then(async (response) => {
      //if the server doesn't return a successful query
      if (response.status != 200) {
        throw err;
      }

      //get the array of movies that the model API returns
      let movieResult = response.data.recommendations;
      
      //process data to get the cover of each movie is possible
      if (Array.isArray(movieResult)) {
        // Use map instead of forEach to return an array of promises
        const promises = movieResult.map(async (movie) => {
          const coverUrl = await getMovieCover(movie.movie_name)
          movie.cover_url = coverUrl;

          deleteObjectField(movie, "combined_features");
          deleteObjectField(movie, "similarity_score");
        });

        // Wait for all promises to resolve before proceeding
        await Promise.all(promises);
      }

      //assign processed data
      movieTitles = movieResult;
    })
    .catch((error) => {
      handleAxiosGetError(error);
    })
    .finally(() => {
      //do something when everything is done
    });

  //return fetched data
  return movieTitles;
}

async function getMovieCover(title){
  let coverUrl;

  await axios.get(`http://www.omdbapi.com`,{
    params: {
      apikey: process.env.OMDB_KEY,
      t: customEncodeURIComponent(title),
      r: 'json',
    },
  })
  .then((response)=>{
    coverUrl = response.data.Poster;

    if (coverUrl == undefined){
      coverUrl = "";
    }
  })
  .catch((error)=>{
    console.error("movie cover get error");
    handleAxiosGetError(error);
  })
  .finally(()=>{
    //cover request
  });

  return coverUrl;
}

module.exports = { searchMovies, getMovieCover };