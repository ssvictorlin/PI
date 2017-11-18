
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
	// TODO: fix the log in --- Daniel
	userRef.child(authData.uid).set({
		provider: authData.provider,
		name: username
	});
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
	var usersRef = db.ref('users');
	usersRef.on('value', snap => {
		console.log(snap.val());
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
	var dummy = [{"label_names":["Lying down","Sitting","Walking","Running","Bicycling","Sleeping","Lab work","In class","In a meeting","At work","Indoors","Outside","In a car","On a bus","Drive - I'm the driver","Drive - I'm a passenger","At home","At a restaurant","Phone in pocket","Exercise","Cooking","Shopping","Strolling","Drinking (alcohol)","Bathing - shower","Cleaning","Doing laundry","Washing dishes","Watching TV","Surfing the internet","At a party","At a bar","At the beach","Singing","Talking","Computer work","Eating","Toilet","Grooming","Dressing","At the gym","Stairs - going up","Stairs - going down","Elevator","Standing","At school","Phone in hand","Phone in bag","Phone on table","With co-workers","With friends"],"label_probs":[0.15246273359778406,0.39510962481370043,0.7859408670360467,0.7268509822852176,0.6702527277320082,0.14569572055674318,0.5725481998446776,0.49117062609760614,0.37394161255782415,0.48370450569907075,0.22156122547013682,0.7603821888873771,0.4095799612030364,0.5330433002609154,0.4610361317893581,0.37504853690598083,0.2775996687849624,0.4203975827038401,0.7571758459695919,0.6910120864772202,0.5894202380939564,0.622998126120764,0.6824990370018089,0.45302994673989044,0.3955862566917546,0.7120771352516866,0.4661526069364162,0.47122730066483215,0.2684033783403562,0.4263050546972094,0.4623493796412541,0.45129988135084914,0.5299312804228788,0.5105423385050563,0.5873671502546757,0.4152714806849995,0.49518344743420534,0.5887873118943475,0.5219884255335008,0.6231409476989456,0.6487649915002957,0.7449327978485311,0.719529003956621,0.6977042409267759,0.6548906781423558,0.5172748451081547,0.6449004615709102,0.6098854406053127,0.19502173219094296,0.5719145820487397,0.5154038755239945]}, {"label_names":["Lying down","Sitting","Walking","Running","Bicycling","Sleeping","Lab work","In class","In a meeting","At work","Indoors","Outside","In a car","On a bus","Drive - I'm the driver","Drive - I'm a passenger","At home","At a restaurant","Phone in pocket","Exercise","Cooking","Shopping","Strolling","Drinking (alcohol)","Bathing - shower","Cleaning","Doing laundry","Washing dishes","Watching TV","Surfing the internet","At a party","At a bar","At the beach","Singing","Talking","Computer work","Eating","Toilet","Grooming","Dressing","At the gym","Stairs - going up","Stairs - going down","Elevator","Standing","At school","Phone in hand","Phone in bag","Phone on table","With co-workers","With friends"],"label_probs":[0.138243573782041,0.7842314756426568,0.34075463584351057,0.2677365074675167,0.15536012479392788,0.11582055863714273,0.618183340951403,0.6583786737524647,0.607568910130989,0.7135816781915726,0.6831663455941169,0.3021074109775519,0.1810777634754429,0.15706023753855047,0.1976471869979117,0.14109481434035057,0.30891596099339125,0.3267174246602178,0.44767416332122456,0.25694360342641803,0.5419052077476935,0.27921949587828765,0.349416251050262,0.3383141211529477,0.499712179938845,0.5005071610000156,0.5084674685174478,0.4451244423787174,0.4820379079923117,0.6222298751147557,0.27267693309441804,0.2800615494938252,0.23896180126597966,0.4100766262825724,0.5314809837467553,0.7511517868357833,0.5875069600005387,0.5035673390666272,0.4351354415048969,0.4635436513659416,0.4072351567427081,0.36918950393309463,0.358877550076117,0.3098556922815204,0.5588687766223757,0.6275020671933373,0.4004284702101998,0.3870378674638436,0.5929981081327199,0.5893133754678473,0.4285714556235328]}];
	var usersRef = db.ref("users");
	// writes to database.
	usersRef.child("cccccc").set({
		"labels": labels
	});

	// res.send({"DummyData": result});
});

exports.app = functions.https.onRequest(app);