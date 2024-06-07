// const { string } = require('@tensorflow/tfjs-node');
const database = require('../config/firebaseConfig');

// for debugging only
// database.ref("/Users/5tyMCCOkKtgAZWyzOfhFHaV9cCt2").once("value", function (snapshot) {
//   console.log(snapshot.val());
// });

async function checkUid(uid) {
  try {
    const snapshot = await database.ref(`/Users/${uid}`).once('value');
    console.log(snapshot.val());
    if (snapshot.exists()) {
      return true // Return user data if exists
    } else {
      return false;
    }
  } catch (error) {
    if (error.message === 'User not found') {
      return { status: 404, message: 'User not found' };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}

module.exports = { checkUid };
