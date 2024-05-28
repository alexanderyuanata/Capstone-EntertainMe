const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
 
(async () => {
    const server = Hapi.server({
        port: parseInt(process.env.PORT) || 8080,
        host: '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    //get model on server start
    /*
    const model = await loadModel();
    server.app.model = model;
 
    console.log('model loaded.');
    */

    //fetch routes
    server.route(routes);

    //handle errors
    server.ext('onPreResponse', function(request, h){
      //put error handlers here

      return h.continue;
    });
 
    //start the server
    await server.start();
    console.log(`server started at: ${server.info.uri}`);
})();

/// note that if the server doesnt start because of missing dlls
/// copy and paste the contents of node_modules/@tensorflow/tfjs-node/deps/lib
/// into node_modules/@tensorflow/tfjs-node/lib/napi-v8
/// idk why but it just works.
