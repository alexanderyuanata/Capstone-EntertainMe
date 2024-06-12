const { searchBooks, getBook } = require("../public_api/bookSearch");
const {
  searchMovies,
} = require("../public_api/movieSearch");

const axios = require("axios");
const {
  checkUid,
  getStressSurvey,
  getPreferencesSurvey,
} = require("../services/userService");
const { getRandomIntInclusive } = require("../services/miscellaneousFunc");
const fetchStressPrediction = require("../public_api/stressPrediction");

function returnResponse(request, h) {
  const response = h.response({
    status: "success",
    message: "this is a response",
  });
  response.code(200);

  return response;
}

//handler to get book recommendation of a specific user
async function getBooksRecommendation(request, h) {
  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const user_id = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!(await checkUid(user_id))) {
    //kalau uid gdk, return not found
    const response = h.response({
      status: "failure",
      message: "no uid found in database",
    });
    response.code(404);

    return response;
  }

  //ambil data survey dari uid
  const surveyData = await getPreferencesSurvey(user_id);

  //kalau undefined berarti ada yg salah di database/server
  if (surveyData == undefined) {
    const response = h.response({
      status: "failure",
      message: "something went wrong, no survey data found in database",
    });
    response.code(500);

    return response;
  }

  // data preprocessing
  // deconstruct the object
  const {
    book_first_question,
    book_second_question,
    book_third_question,
    book_fourth_question,
    book_fifth_question,
  } = surveyData;

  const bookPref = {};

  // preprocess our data
  book_first_question == "No, I need recommendations"
    ? (bookPref.text = "random")
    : (bookPref.text = book_first_question);

  if (book_second_question != "No, I need recommendations") {
    bookPref.author = book_second_question;
  }

  if (
    book_third_question != "No, I need recommendations" &&
    book_first_question == "No, I need recommendations"
  ) {
    bookPref.text = book_third_question;
  }

  if (book_fourth_question == "No preferences") {
    switch (book_fourth_question) {
      case "3 stars":
        bookPref.rating_preference = 3;
      case "4 stars":
        bookPref.rating_preference = 4;
      case "5 stars":
        bookPref.rating_preference = 5;
      default:
        bookPref.rating_preference = 3;
    }
  }

  // fifth question idk? for now dont use
  console.log(bookPref);

  try {
    let books = await searchBooks(bookPref);

    const response = h.response({
      status: "success",
      message: "returned a list of book recommendations",
      title_count: books.length,
      titles: books,
    });
    response.code(200);

    return response;
  } catch (error) {
    const response = h.response({
      status: "failure",
      message: "something went wrong when getting the recommendations",
      error_msg: error.message,
    });
    response.code(500);

    return response;
  }
}

//handler for movies
async function getMoviesRecommendation(request, h) {
  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const user_id = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!(await checkUid(user_id))) {
    //kalau uid gdk, return not found
    const response = h.response({
      status: "failure",
      message: "no uid found in database",
    });
    response.code(404);

    return response;
  }

  //ambil data survey dari uid
  const surveyData = await getPreferencesSurvey(user_id);

  //kalau undefined berarti ada yg salah di database/server
  if (surveyData == undefined) {
    const response = h.response({
      status: "failure",
      message: "something went wrong, no survey data found in database",
    });
    response.code(500);

    return response;
  }

  //preprocess survey data
  //deconstruct survey data
  const {
    movie_first_question,
    movie_second_question,
    movie_third_question,
    movie_fourth_question,
    movie_fifth_question,
    movie_sixth_question,
    movie_seventh_question
  }
  = surveyData;

  let inputData = {};

  // get the year of the movie
  switch(movie_first_question){
    case "Last 5 years":
      inputData.year = 2019;
      break;
    case "Last 10 years":
      inputData.year = 2014;
      break;
    case "Last 20 years":
      inputData.year = 2004;
      break;
    case "Any year":
      inputData.year = 1900;
      break;
    default:
      inputData.year = 1900;
      break;
  }

  // get the runtime of the movie
  switch(movie_second_question){
    case "Short (less than 90 minutes)":
      inputData.runtime = 90;
      break;
    case "Regular (less than 150 minutes)":
      inputData.runtime = 150;
      break;
    case "Long (more than 150 minutes)":
      inputData.runtime = 500;
      break;
    default:
      inputData.runtime = 150;
      break;
  }

  // get the genre of the movie
  inputData.genre = movie_third_question;

  // get the rating of the movie
  inputData.rating = parseInt(movie_fourth_question)

  if (movie_fifth_question != "No, I need recommendations"){
    inputData.director = movie_fifth_question;
  }

  if (movie_sixth_question != "No, I need recommendations"){
    inputData.star = movie_sixth_question;
  }

  switch(movie_seventh_question){
    case "Movies that are lesser-known":
      inputData.votes = getRandomIntInclusive(0,5000);
      break;
    case "Movies that are talked about quite often":
      inputData.votes = getRandomIntInclusive(5001,10000);
      break;
    case "Popular movies that many people know about":
      inputData.votes = getRandomIntInclusive(10001,15000);
      break;
    default:
      inputData.votes = getRandomIntInclusive(5001,10000);
      break;
  }

  try {
    let movies = await searchMovies(inputData);
  
    const response = h.response({
      status: "success",
      message: "successfully retrieved movie recommendation from model",
      movie_count: movies.length,
      movies: movies,
    });

    response.code(200);
    return response;
  }
  catch (error) {
    const response = h.response({
      status: "failure",
      message: "something went wrong when getting the recommendations",
      error_msg: error.message,
    });

    response.code(500);
    return response;
  }
}

//handler for travel
async function getTravelRecommendation(request, h) {
  //TODO: ini handler utk /recommend/travel
  //handler ini akan menyarankan lokasi jalan2 pengguna berdasarkan survey

  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const uid = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!(await checkUid(uid))) {
    //kalau uid gdk, return not found
    const response = h.response({
      status: "failure",
      message: "no uid found in database",
    });
    response.code(404);

    return response;
  }

  // aman, lanjut

  // TODO, ambil data dari database disini, hanya berkaitan dengan survey lokasi wisata

  // TODO, susun jadi json body yg formatnya seperti ini, utk isinya silakan lihat dokumentasi dari tim ML
  // "text" itu HARUS ADA, kalau nggak ada modelnya g kerja, pastiin minimal text ada, kalau gdk balekin 400 aja
  // {
  //   "text": "Saya ingin pergi ke tempat yang berhubungan dengan sejarah dan budaya.",
  //   "city": "Jakarta",
  //   "rating_preference": "4 stars and above",
  //   "review_preference": "More than 20 reviews"
  // }

  // TODO buat POST request dengan body pakai json di atas ke https://travel-recommendation-4nqq6tztla-et.a.run.app?key=API_KEY
  // api key dalam bentuk environment variable (ini ada dalam .gitignore, bisa dibuat di lokal buat ujicoba tapi jangan dipush)
  // untuk .env ada sendiri di cloud, aku yg samain, yg penting API_KEY jangan di expose di code (best practice)

  // handle semua kejadian dalam request (time out, failure, etc sesuai yg lu pikirin)

  // kalau ud dikembalikan dengan aman, disunting datanya sesuai yang aku bilang
  // karena array, pakai looping utk tiap elemen atau .map bisa juga, contoh ada di bookSearch.js
  // contoh elemen array:
  // {
  //   "Categories": "Culture", !BUANG
  //   "Categories_Label": 0, !BUANG
  //   "City": "Jakarta",
  //   "Coordinate": "{'lat': -6.137644799999999, 'lng': 106.8171245}",
  //   "Description": "The old city in Jakarta, which is also called Kota Tua, is centered on Alun-Alun Fatahillah, which is a busy square with routine performances of traditional dances. The Jakarta History Museum is a Dutch-era building with paintings and antiques, while the Wayang Museum displays Javanese wooden puppets. Glodok Village, or Chinatown, is famous for its street food, such as dumplings and fried noodles. Nearby, there are schooners and fishing boats in the quaint Sunda Kelapa harbor",
  //   "Lat": -61376448, !BUANG
  //   "Long": 1068171245, !BUANG
  //   "Place_Name": "Kota Tua",
  //   "Price": 0,
  //   "Rating_Count": 25,
  //   "Ratings": 46,
  //   "Time_Minutes": 90.0,
  //   "_1": 2 !BUANG
  // },

  // hasil akhirnya
  // {
  //   "City": "Jakarta",
  //   "Coordinate": "{'lat': -6.137644799999999, 'lng': 106.8171245}",
  //   "Description": "The old city in Jakarta, which is also called Kota Tua, is centered on Alun-Alun Fatahillah, which is a busy square with routine performances of traditional dances. The Jakarta History Museum is a Dutch-era building with paintings and antiques, while the Wayang Museum displays Javanese wooden puppets. Glodok Village, or Chinatown, is famous for its street food, such as dumplings and fried noodles. Nearby, there are schooners and fishing boats in the quaint Sunda Kelapa harbor",
  //   "Place_Name": "Kota Tua",
  //   "Price": 0,
  //   "Rating_Count": 25,
  //   "Ratings": 46,
  //   "Time_Minutes": 90.0,
  // },

  // TODO: kalau sudah disusun jadi array yang bersih, kembalikan jadi response ke MD

  // ini placeholder
  const finalRecommendation = [];

  const response = h.response({
    status: "success",
    message: "travel recommendation successfully returned",
    data: finalRecommendation,
  });
  response.code(200);

  return response;
}

//handler for stress prediction
async function getStressPrediction(request, h) {
  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const user_id = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!(await checkUid(user_id))) {
    //kalau uid gdk, return not found
    const response = h.response({
      status: "failure",
      message: "no uid found in database",
    });
    response.code(404);

    return response;
  }

  //ambil data survey dari uid
  const surveyData = await getStressSurvey(user_id);

  //kalau undefined berarti ada yg salah di database/server
  if (surveyData == undefined) {
    const response = h.response({
      status: "failure",
      message: "something went wrong, no survey data found in database",
    });
    response.code(500);

    return response;
  }

  //proses data sebelum dikirim ke model
  const payload = {};
  let rawData;
  let processedData;

  //data durasi tidur
  rawData = parseInt(surveyData["stress_first_question"], 10);
  payload["sleep_duration"] = rawData;

  //data kualitas tidur
  rawData = surveyData["stress_second_question"];
  switch (rawData) {
    case "Poor":
      processedData = getRandomIntInclusive(1, 4);
      break;
    case "Fair":
      processedData = getRandomIntInclusive(5, 7);
      break;
    case "Good":
      processedData = getRandomIntInclusive(8, 10);
      break;
    default:
      processedData = getRandomIntInclusive(5, 7);
      break;
  }
  payload["sleep_quality"] = processedData;

  //data aktivitas fisik
  rawData = surveyData["stress_third_question"];
  switch (rawData) {
    case "Lightly Active":
      processedData = getRandomIntInclusive(10, 40);
      break;
    case "Moderately Active":
      processedData = getRandomIntInclusive(41, 70);
      break;
    case "Heavily Active":
      processedData = getRandomIntInclusive(71, 100);
      break;
    default:
      processedData = getRandomIntInclusive(41, 70);
      break;
  }
  payload["physical_activity"] = processedData;

  //data kategori bmi
  rawData = surveyData["stress_fourth_question"];
  switch (rawData) {
    case "Normal":
      processedData = 0;
      break;
    case "Overweight and Underweight":
      processedData = 1;
      break;
    case "Obesity":
      processedData = 2;
      break;
    default:
      processedData = 0;
      break;
  }
  payload["bmi"] = processedData;

  //data tekanan darah
  rawData = surveyData["stress_fifth_question"];
  switch (rawData) {
    case "Low":
      processedData = getRandomIntInclusive(0, 7);
      break;
    case "Normal":
      processedData = getRandomIntInclusive(8, 16);
      break;
    case "High":
      processedData = getRandomIntInclusive(17, 24);
      break;
    default:
      processedData = getRandomIntInclusive(8, 16);
      break;
  }
  payload["blood_pressure"] = processedData;

  //data denyut jantung
  rawData = surveyData["stress_sixth_question"];
  switch (rawData) {
    case "Low":
      processedData = getRandomIntInclusive(30, 59);
      break;
    case "Normal":
      processedData = getRandomIntInclusive(60, 79);
      break;
    case "High":
      processedData = getRandomIntInclusive(80, 95);
      break;
    default:
      processedData = getRandomIntInclusive(60, 79);
      break;
  }
  payload["heart_rate"] = processedData;

  //data langkah kaki
  rawData = surveyData["stress_seventh_question"];
  switch (rawData) {
    case "Rarely":
      processedData = getRandomIntInclusive(1000, 4000);
      break;
    case "Occasionally":
      processedData = getRandomIntInclusive(4001, 7000);
      break;
    case "Frequently":
      processedData = getRandomIntInclusive(7001, 10000);
      break;
    default:
      processedData = getRandomIntInclusive(4001, 7000);
      break;
  }
  payload["daily_steps"] = processedData;

  //data sleep disorder
  rawData = surveyData["stress_eight_question"];
  if (rawData == "Yes") {
    payload["sleep_disorder"] = 1;
  } else {
    payload["sleep_disorder"] = 0;
  }

  //finished processing, send to model and wait
  const prediction = await fetchStressPrediction(payload);
  console.log(prediction);

  //send back as response
  const response = h.response({
    status: "success",
    message: "stress prediction successful",
    prediction: prediction,
  });
  response.code(200);

  return response;
}

module.exports = {
  returnResponse,
  getBooksRecommendation,
  getMoviesRecommendation,
  getTravelRecommendation,
  getStressPrediction,
};
