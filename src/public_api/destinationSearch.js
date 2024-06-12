const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");
const { deleteObjectField, getRandomString } = require("../services/miscellaneousFunc");

require('dotenv').config();

//constants
const instance = axios.create({
    baseURL: process.env.TRAVEL_MODEL_URL || "http://localhost:5000",
    timeout: 1000,
  });

const TRAVEL_LIMIT = 8;

const LOCATION_IMG = [
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/candi.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/danau.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/gate.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/gunung.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/gunung2.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/pagoda.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/sawah.jpg",
    "https://storage.googleapis.com/travel-photos-capstone-entertainme/waterfall.jpg",
];

async function searchDestinations (inputData) {
    let travelLocations = [];

    //send a get request to the gateway API
    await instance
      .post(
        "/recommend", 
        inputData,
        {
        params: {
          key: process.env.TRAVEL_API_KEY,
        },
      })
      .then(async (response) => {
        //if the server doesn't return a successful query
        if (response.status != 200) {
          throw err;
        }
  
        //get the array of books that the public API returns
        let travelResult = response.data.recommendations;
        const leftover = TRAVEL_LIMIT - travelResult.length;
        
  
        if (leftover > 0){
          const filler = (await getRandomDestinations()).slice(0, leftover);
          console.log("added some travel destinations");
          travelResult = travelResult.concat(filler);
        }
  
        //process data to get the cover and detail
        if (Array.isArray(travelResult)) {
          // Use map instead of forEach to return an array of promises
          const promises = travelResult.map(async (location) => {
            //delete useless fields
            deleteObjectField(location, "Categories_Label");
            deleteObjectField(location, "Lat");
            deleteObjectField(location, "Long");
            deleteObjectField(location, "_1");

            //add a random cover img url
            location.coverUrl = getRandomString(LOCATION_IMG);
          });
  
          // Wait for all promises to resolve before proceeding
          await Promise.all(promises);
        }
  
        //assign processed data
        travelLocations = travelResult;
      })
      .catch((error) => {
        handleAxiosGetError(error);
      })
      .finally(() => {
        //do something when everything is done
      });
  
    //return fetched data
    return travelLocations;
}

// async function searchDestinationDetail(key){
//     let destinationDetail;

//     await axios.get(`${baseUrl}/en/places/xid/{xid}apikey=${apiKey}`,{
//     })
//     .then((response)=>{
//         const destinationData = response.data.detail;

//         destinationDetail = {
//             rate: destinationData.Rate,
//             point : {
//                 lon: destinationData.lon,
//                 lat: destinationData.lat,
//         },
//     };
//     })
//     .catch((error)=>{
//         handleAxiosGetError(error);
//     })
//     .finally(()=>{
        
//     });

//     return destinationDetail;
// }

async function getRandomDestinations(){
    let locationDetails = [];
  
    //send a get request to the gateway API
    await instance
      .post(
        "/recommend", 
        {
          text:"random"
        },
        {
        params: {
          key: process.env.TRAVEL_API_KEY,
        },
      })
      .then(async (response) => {
        //if the server doesn't return a successful query
        if (response.status != 200) {
          throw err;
        }
  
        //get the array of locations that the public API returns
        const randomLocations = response.data.recommendations;
  
        //assign processed data
        locationDetails = randomLocations;
      })
      .catch((error) => {
        handleAxiosGetError(error);
      })
      .finally(() => {
        //do something when everything is done
      });
    
    //return fetched data
    return locationDetails;
  }

module.exports = { searchDestinations }
