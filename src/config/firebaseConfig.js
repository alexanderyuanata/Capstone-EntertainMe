const admin = require('firebase-admin');
const path = require('path');

// Memuat file kunci akun layanan
const serviceAccount = require (path.join(__dirname, './serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://entertainme-firebase-default-rtdb.firebaseio.com/"
});

const database = admin.database();

module.exports = database;
