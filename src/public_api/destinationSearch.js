const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");
require('dotenv').config();

const apiKey = process.env.OTM_APIKEY;
const baseUrl = process.env.OTM_URL;

async function searchDestinations (query) {
    let destionationList = [];

    await axios.get(
        `${baseUrl}/en/places/xid/{xid}?apikey=${apiKey}`,{
    })
    .then((response)=>{
        const destinations = response.data.destination;

        destinations.forEach((destination) => {
            destionationList.push ({
                name: destination.Name,
                image: destination.Image,
            });
        });
    })
    .catch ((error)=>{  
        handleAxiosGetError(error);
    })
    .finally(()=>{
        console.log('-----------------------end of request-----------------------');
    });

    return destionationList;
}

async function searchDestinationDetail(key){
    let destinationDetail;

    await axios.get(`${baseUrl}/en/places/xid/{xid}apikey=${apiKey}`,{
    })
    .then((response)=>{
        const destinationData = response.data.detail;

        destinationDetail = {
            rate: destinationData.Rate,
            point : {
                lon: destinationData.lon,
                lat: destinationData.lat,
        },
    };
    })
    .catch((error)=>{
        handleAxiosGetError(error);
    })
    .finally(()=>{
        console.log('-----------------------end of request-----------------------')
    });

    return destinationDetail;
}

module.exports = {searchDestinations, searchDestinationDetail}
