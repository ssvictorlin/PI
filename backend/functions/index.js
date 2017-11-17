
const functions = require('firebase-functions');
const express = require('express');
const url = require('url');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const app = express();
const dbroutes = require('./routes/database.js');
const db = admin.database();

app.get('/register', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	var query = url.parse(req.url, true).query;
	var username = query['username'];
	var randomNum =  0;
	var i;
	var randomArr = [];
	for (i = 0; i < 6; i++) {
		randomNum = Math.floor((Math.random() * 51) + 1);
		randomArr.push(randomNum);
	}

	var labels = [];

	labels.push({label: "Lying down ", amount: 0});
	labels.push({label: "Sitting", amount: 0});
	labels.push({label: "Standing", amount: 0});
	labels.push({label: "Walking", amount: 0});
	labels.push({label: "Running", amount: 0});
	labels.push({label: "Bicycling", amount: 0});
	labels.push({label: "Sleeping", amount: 0});
	labels.push({label: "Lab work", amount: 0});
	labels.push({label: "In class", amount: 0});
	labels.push({label: "In a meeting", amount: 0});
	labels.push({label: "At work", amount: 0});
	labels.push({label: "Indoors", amount: 0});
	labels.push({label: "Outside", amount: 0});
	labels.push({label: "In a car", amount: 0});
	labels.push({label: "On a bus", amount: 0});
	labels.push({label: "Drive – I’m the driver", amount: 0});
	labels.push({label: "Driver – I’m the passenger", amount: 0});
	labels.push({label: "At home", amount: 0});
	labels.push({label: "At school", amount: 0});
	labels.push({label: "At a restaurant", amount: 0});
	labels.push({label: "Exercising", amount: 0});
	labels.push({label: "Cooking", amount: 0});
	labels.push({label: "Shopping", amount: 0});
	labels.push({label: "Strolling", amount: 0});
	labels.push({label: "Drinking (alcohol)", amount: 0});
	labels.push({label: "Bathing – shower", amount: 0});
	labels.push({label: "Cleaning", amount: 0});
	labels.push({label: "Doing laundry", amount: 0});
	labels.push({label: "Washing dishes", amount: 0});
	labels.push({label: "Watching TV", amount: 0});
	labels.push({label: "Surfing the internet", amount: 0});
	labels.push({label: "At a party", amount: 0});
	labels.push({label: "At a bar", amount: 0});
	labels.push({label: "At the beach", amount: 0});
	labels.push({label: "Singing", amount: 0});
	labels.push({label: "Talking", amount: 0});
	labels.push({label: "Computer work", amount: 0});
	labels.push({label: "Eating", amount: 0});
	labels.push({label: "Toilet", amount: 0});
	labels.push({label: "Grooming", amount: 0});
	labels.push({label: "Dressing", amount: 0});
	labels.push({label: "At the gym", amount: 0});
	labels.push({label: "Stairs – going up", amount: 0});
	labels.push({label: "Stairs – going down", amount: 0});
	labels.push({label: "Elevator", amount: 0});
	labels.push({label: "Phone in pocket", amount: 0});
	labels.push({label: "Phone in hand", amount: 0});
	labels.push({label: "Phone in bag", amount: 0});
	labels.push({label: "Phone on table", amount: 0});
	labels.push({label: "With co-workers", amount: 0});
	labels.push({label: "With friends", amount: 0});

	console.log(labels[3].label);

	for (i = 0; i < 6; i++) {
		var ran = randomArr[i];
		labels[ran-1].amount = (i+1) * 1000;
	}

	var usersRef = db.ref("users");
	// writes to database.
	usersRef.child(username).set({
		"labels": labels
	});
	res.send("Unername: " + username);
});

app.get('/readUser', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	var usersRef = admin.database().ref().child('users');
	usersRef.on('amount', snap=> {
		res.send(snap.val());
	});
});

app.get('/testroute', (req, res) => {
  res.send({"DummyData": "Truly Dummy Data"});
});

app.get('/profile', (req, res) => {
  res.send({
  	"name": "Butter Croissants",
  	"radarChart": "https://i.imgur.com/rgJ7bXi.png",
  	"avatar": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
  });
});

app.get('/crowns', (req, res) => {
  res.send({
  	"crownHolder": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
  	"pieChart": "https://cdn-images-1.medium.com/max/1600/1*RSqZ9sw6-mOXAAptmvz4Dg.png"
  });
});

app.get('/dbtest', dbroutes.test);

// kind of useless now, just reseiving data and sending back
app.put('/send', (req, res) => {
	const result = req.body;
	res.send({"DummyData": result});
});

exports.app = functions.https.onRequest(app);