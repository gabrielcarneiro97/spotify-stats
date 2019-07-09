const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);

const db = admin.firestore();

module.exports = {
  functions,
  db,
};
