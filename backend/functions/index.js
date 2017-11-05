const functions = require('firebase-functions');
const express = require('express');

const app = express();
const dbroutes = require('./routes/database.js');

app.get('/testroute', (request, response) => {
  response.send({"DummyData": "Truly Dummy Data"});
});

app.get('/profile', (request, response) => {
  response.send({
  	"DummyData": "Truly Dummy Data",
  	"name": "Butter Croissants",
  	"radarChart": "https://i.imgur.com/rgJ7bXi.png",
  	"image": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
  });
});

app.get('/crowns', (request, response) => {
  response.send({
  	"crownHolder": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
  	"pieChart": "https://cdn-images-1.medium.com/max/1600/1*RSqZ9sw6-mOXAAptmvz4Dg.png"
  });
});

app.get('/dbtest', dbroutes.test);

exports.app = functions.https.onRequest(app);