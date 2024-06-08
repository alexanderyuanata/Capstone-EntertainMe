const { searchBooks, getBook } = require("../public_api/bookSearch");
const doQuery = require("../public_api/databaseGateway");
const {
  searchMovies,
  searchMovieDetail,
} = require("../public_api/movieSearch");


const axios = require("axios");
const { checkUid, getStressSurvey } = require("../services/userService");
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
  //get the uid from query parameters
  const uid = request.query.uid;

  //if there's no uid passed in, then return a failure
  if (uid == undefined){
    const response = h.response({
      status: "failure",
      message: "no uid in query parameters, cannot fetch recommendation data",
    });
    response.code(400);
    return response;
  }

  //TODO: write code that fetches data from the firebase database and pass it to searchBooks
  //const userBookPreference = TODO FUNCTION HERE(uid);

  //replace the variable below after todo is done, recommendedBooks is an ARRAY that holds strings consists of titles that we recommend
  //the array should be limited to 10 books at maximum
  //write a function that takes userBookPreference and returns an array to assign to recommendedBooks, this uses the deployed ML model
  const recommendedBooks = []//write ML function here;

  //try to get a response from the gateway API
  try {
    //wait for the details of each book
    let books = await searchBooks(recommendedBooks);

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

async function getBookDetail(request, h) {
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null) {
    const response = h.response({
      status: "failure",
      message: "no book key detected",
    });
    response.code(400);

    return response;
  }

  const detail = await getBook(key);
  const response = h.response({
    status: "success",
    message: "got synopsis of book",
    synopsis: detail,
  });
  response.code(200);

  return response;
}

async function getMoviesRecommended(request, h) {
  let movies = await searchMovies("spider-man");

  console.log("received movie data here");

  const response = h.response({
    status: "success",
    message: "successfully sent an API call to open movie database",
    data: movies,
  });
  response.code(200);

  return response;
}

async function getMovieDetail(request, h) {
  const params = request.query;
  const key = params.key;

  //if there's no key parameter we should return a failure response
  if (key == null) {
    const response = h.response({
      status: "failure",
      message: "no movie key detected",
    });
    response.code(400);

    return response;
  }

  const detail = await searchMovieDetail(key);
  const response = h.response({
    status: "success",
    message: "got detail of movie",
    detail: detail,
  });
  response.code(200);

  return response;
}

async function performQuery(request, h) {
  let content = await doQuery();

  //if we failed to fetch any query data
  if (content == undefined) {
    const response = h.response({
      status: "failure",
      message: "failed to contact database API",
    });
    response.code(500);

    return response;
  }

  const response = h.response({
    status: "success",
    message: "contacted database gateway",
    data: content,
  });
  response.code(200);

  return response;
}

async function getTravelRecommendation(request, h){
  //TODO: ini handler utk /recommend/travel
  //handler ini akan menyarankan lokasi jalan2 pengguna berdasarkan survey

  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const uid = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!await checkUid(uid)){
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

async function getStressPrediction(request, h){
  //ambil uid dari request param, cek, klo gdk return 404 baru bilang uid gdk di database
  const user_id = request.query.uid;

  //ingat await, pastikan uid ada dan data sudah diambil sebelum lanjut
  if (!await checkUid(user_id)){
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
  if (surveyData == undefined){
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
  switch(rawData){
    case "Poor":
      processedData = getRandomIntInclusive(1,4);
      break;
    case "Fair":
      processedData = getRandomIntInclusive(5,7);
      break;
    case "Good":
      processedData = getRandomIntInclusive(8,10);
      break;
    default:
      processedData = getRandomIntInclusive(5,7);
      break;
  }
  payload["sleep_quality"] = processedData;

  //data aktivitas fisik
  rawData = surveyData["stress_third_question"];
  switch(rawData){
    case "Lightly Active":
      processedData = getRandomIntInclusive(10,40);
      break;
    case "Moderately Active":
      processedData = getRandomIntInclusive(41,70);
      break;
    case "Heavily Active":
      processedData = getRandomIntInclusive(71,100);
      break;
    default:
      processedData = getRandomIntInclusive(41,70);
      break;
  }
  payload["physical_activity"] = processedData;

  //data kategori bmi
  rawData = surveyData["stress_fourth_question"];
  switch(rawData){
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
  switch(rawData){
    case "Low":
      processedData = getRandomIntInclusive(0,7);
      break;
    case "Normal":
      processedData = getRandomIntInclusive(8,16);
      break;
    case "High":
      processedData = getRandomIntInclusive(17,24);
      break;
    default:
      processedData = getRandomIntInclusive(8,16);
      break;
  }
  payload["blood_pressure"] = processedData;

  //data denyut jantung
  rawData = surveyData["stress_sixth_question"];
  switch(rawData){
    case "Low":
      processedData = getRandomIntInclusive(30,59);
      break;
    case "Normal":
      processedData = getRandomIntInclusive(60,79);
      break;
    case "High":
      processedData = getRandomIntInclusive(80,95);
      break;
    default:
      processedData = getRandomIntInclusive(60,79);
      break;
  }
  payload["heart_rate"] = processedData;

  //data langkah kaki
  rawData = surveyData["stress_seventh_question"];
  switch(rawData){
    case "Rarely":
      processedData = getRandomIntInclusive(1000,4000);
      break;
    case "Occasionally":
      processedData = getRandomIntInclusive(4001,7000);
      break;
    case "Frequently":
      processedData = getRandomIntInclusive(7001,10000);
      break;
    default:
      processedData = getRandomIntInclusive(4001,7000);
      break;
  }
  payload["daily_steps"] = processedData;

  //data sleep disorder
  rawData = surveyData["stress_eight_question"];
  if (rawData == "Yes"){
    payload["sleep_disorder"] = 1;
  }
  else {
    payload["sleep_disorder"] = 0;
  }

  //finished processing, send to model and wait
  const prediction = await fetchStressPrediction(payload);
  console.log(prediction)

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
  getBookDetail,
  getMoviesRecommended,
  getMovieDetail,
  performQuery,
  getTravelRecommendation,
  getStressPrediction
};
