const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");

require('dotenv').config();

const FILTER_TYPE='movie';
const PLOT_TYPE='short';

async function searchMovies(query){
  let movieList;

  await axios.get(`http://www.omdbapi.com`,{
    params: {
      apikey: process.env.OMDB_KEY,
      s: query,
      type: FILTER_TYPE,
      r: 'json',
    },
  })
  .then((response)=>{
    const movies = response.data.Search;
    movieList = [];
    
    movies.forEach(movie => {
      movieList.push({
        title: movie.Title,
        release_year: movie.Year,
        poster_url: movie.Poster,
        key: movie.imdbID,
      });
    });
  })
  .catch((error)=>{
    handleAxiosGetError(error);
  })
  .finally(()=>{
    console.log('-----------------------end of request-----------------------');
  });

  return movieList;
}

async function searchMovieDetail(key){
  let movieDetail;

  await axios.get(`http://www.omdbapi.com`,{
    params: {
      apikey: process.env.OMDB_KEY,
      i: key,
      plot: PLOT_TYPE,
      r: 'json',
    },
  })
  .then((response)=>{
    const movieData = response.data;

    movieDetail = {
      runtime: movieData.Runtime,
      genre: movieData.Genre,
      synopsis: movieData.Plot,
      language: movieData.Language,
      rating: movieData.imdbRating,
    };
  })
  .catch((error)=>{
    handleAxiosGetError(error);
  })
  .finally(()=>{
    console.log('-----------------------end of request-----------------------');
  });

  return movieDetail;
}

module.exports = { searchMovies, searchMovieDetail };