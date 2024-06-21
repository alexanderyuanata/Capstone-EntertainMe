# Capstone-EntertainMe Cloud Computing Backend
This is the backend API used in the EntertainMe project that is hosted on App Engine. The entire backend application is self contained in this repository.

## GCP Resources Utilized
- `App Engine` to host this backend API
- `Cloud Run` to deploy the ML APIs as containers
- `Cloud Storage` to store static data
- `Secret Manager` to obscure API keys
- `Firebase` to store user data

## Third Party/Public APIs Utilized
- [OMDB API](https://www.omdbapi.com/)
- [Google Books API](https://developers.google.com/books)

## Disclaimer
To run this backend, you need to configure the following `.env` file
    
    OMDB_KEY=_YOUR PRIVATE OMDB KEY
    
    GOOGLE_BOOKS_KEY=_YOUR PRIVATE GOOGLE BOOKS KEY
    
    STRESS_API_KEY=_YOUR PRIVATE STRESS API KEY
    STRESS_MODEL_URL=_YOUR PRIVATE STRESS MODEL URL
    
    BOOK_API_KEY=_YOUR PRIVATE BOOK API KEY
    BOOK_MODEL_URL=_YOUR PRIVATE BOOK MODEL URL
    
    MOVIE_API_KEY=_YOUR PRIVATE MOVIE API KEY
    MOVIE_MODEL_URL=_YOUR PRIVATE MOVIE MODEL URL
    
    TRAVEL_API_KEY=_YOUR PRIVATE TRAVEL API KEY
    TRAVEL_MODEL_URL=_YOUR PRIVATE TRAVEL MODEL URL
    
    GOOGLE_APPLICATION_CREDENTIALS=_A LOCAL ROUTE TO YOUR SERVICE ACCOUNT KEY FILE

The environmental variables above are read whenever the backend API makes a request. Additionally, the backend API needs a realtime database and a service account file to access that database.

If the ML Model URLs are not provided, the backend will alternatively use [http://localhost:5000](http://localhost:5000) as an endpoint, if you want to run this locally then make sure an ML Model is up and listening on that address. If you want to disable the validation and requirement for UIDs, feel free to fork the repository and comment out the function that checks for UID and rewrite the handler to receive data from a json payload or other alternatives.

## ML API Documentation
- [Stress Prediction API](https://github.com/entertainmeproject/ml-api-stress)
- [Book Recommendation API](https://github.com/entertainmeproject/ml-api-book)
- [Movie Recommendation API](https://github.com/entertainmeproject/ml-api-movie)
- [Travel Recommendation API](https://github.com/entertainmeproject/ml-api-travel)

## Local Installation
Clone the repository into the current directory

    git clone https://github.com/entertainmeproject/capstone-entertainme-backendapi.git

Navigate into the cloned directory

    cd capstone-entertainme-backendapi

Run the Backend API

    npm run start-dev

The API will run using nodemon on [http://localhost:8080](http://localhost:8080), you can try [http://localhost:8080/check](http://localhost:8080/check) to see if the API is currently running.

Alternatively, you can run it with

    npm run start

## GCP Installation
Clone the repository into the `Cloud Shell` directory

    git clone https://github.com/entertainmeproject/capstone-entertainme-backendapi.git

Navigate into the cloned directory

    cd capstone-entertainme-backendapi

Deploy it with App Engine

    gcloud app deploy
