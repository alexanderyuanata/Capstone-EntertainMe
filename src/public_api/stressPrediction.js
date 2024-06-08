const axios = require("axios");
const { handleAxiosGetError } = require("../exceptions/ErrorHandler");
const { getFirstElement, customEncodeURIComponent } = require('../services/miscellaneousFunc')

require('dotenv').config();

// configurations for querying model server
const instance = axios.create({
  // kalau ada server lokalnya, pakai localhost aja
  baseURL: process.env.STRESS_MODEL_URL || "http://localhost:5000",
  timeout: 1000,
});

// ambil data prediksi dari api model
async function fetchStressPrediction(input_data){
  let predictedStress;

  // kirim POST dengan data dari input_data sebagai payload json
  await instance.post(
    "/predict", 
    input_data,
    {
    params:{
      // truh locally
      key: process.env.STRESS_API_KEY,
    },
  })
  .then(async (response) => {
    // if the server doesn't return an OK query, throw error
    if (response.status != 200){
      throw err;
    }
    predictedStress = response.data.stress_level;
  })
  .catch((error) => {
    handleAxiosGetError(error);
  })
  .finally(() => {

  })

  return predictedStress;
}

module.exports = fetchStressPrediction;