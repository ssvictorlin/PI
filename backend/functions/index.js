const functions = require('firebase-functions');
const express = require('express');

const app = express();

app.get('/testroute', (request, response) => {
  console.log("HERE");
  response.send({"DummyData": "Truly Dummy Data"});
});

exports.app = functions.https.onRequest(app);
