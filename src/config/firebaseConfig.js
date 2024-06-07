const admin = require('firebase-admin');
const path = require('path');

// Memuat file kunci akun layanan Anda
const serviceAccount = require (path.join(__dirname, './serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://entertainme-firebase-default-rtdb.firebaseio.com/" // Ganti dengan URL database Anda
});

const database = admin.database();

module.exports = database;
