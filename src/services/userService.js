const { string } = require('@tensorflow/tfjs-node');
const database = require('../config/firebaseConfig');


async function checkUid(uid) {
  try {
    const snapshot = await database.ref(`/users/${uid}`).once('value');
    if (snapshot.exists()) {
      return snapshot.val(); // Return user data if exists
    } else {
      throw new Error('User not found');
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
