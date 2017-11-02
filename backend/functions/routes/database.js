// Initialize Firebase
var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyA9XhQ19knvbKb7DqXp4vwGVSGkQPuqyzw",
  authDomain: "ubiquitouspi-ddcb0.firebaseapp.com",
  databaseURL: "https://ubiquitouspi-ddcb0.firebaseio.com",
  projectId: "ubiquitouspi-ddcb0",
  storageBucket: "ubiquitouspi-ddcb0.appspot.com",
  messagingSenderId: "909294414727"
};
firebase.initializeApp(config);

exports.test = (request, response) => {
  response.send('Database file works');
}
