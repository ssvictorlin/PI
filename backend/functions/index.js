const functions = require('firebase-functions');
const express = require('express');

const app = express();
const dbroutes = require('./routes/database.js');

app.get('/testroute', (request, response) => {
  response.send({"DummyData": "Truly Dummy Data"});
});

app.get('/dbtest', dbroutes.test);

exports.app = functions.https.onRequest(app);
