
const functions = require('firebase-functions');
const express = require('express');
const url = require('url');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const app = express();
const dbroutes = require('./routes/database.js');
const db = admin.database();


/*
	This creates a user's Group.
	Parameters:
		userEmail: The owner of the group's email.
		groupName: Name of group to create.
*/
app.get('/createGroup', (req, res) => {
    
	/* Time Logic */
	var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    printDate = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
	
	/* Creating Group Logic */
	var query = url.parse(req.url, true).query;
	var userEmail = query['userEmail'];
	var groupName = query['groupName'];
	var groupRef =  admin.database().ref("groups")
	var ownerRef = admin.database().ref('users/'+userEmail);
	groupRef.child(groupName).set({
		"owner": userEmail
	});
	ownerRef.child("ownerGroup").once('value').then(snapshot => {
       ownerRef.child("ownerGroup").child(groupName).set({
			"CreatedTime": printDate
	   });
		
	});
	res.send("Sucess")
	
});
/*
	This delete a friend from the friend list of User
	Parameters:
		userEmail =  the person's deleting email.
		friendEmail = the person who is being deleted email.
		
*/

app.get('/deleteFriend', (req, res)  => {
	var query = url.parse(req.url, true).query;
	var userEmail = query['userEmail'];
	var friendEmail = query['friendEmail'];
	var usersRef = admin.database().ref('users/'+userEmail);
	var friendRef = admin.database().ref('users/'+friendEmail);
	updates = {}
	updates[friendEmail] = null
	updates2 = {}
	updates2[userEmail] = null
	usersRef.child("friends").update(updates);
	friendRef.child("friends").update(updates2);
	res.send(friendEmail);
	
});

/*
	This adds a user to Group 
	Parameters:
		userName = person to add
		userEmail = his/her email
		groupName = name of group to add user to.
*/
app.get('/addToGroup', (req, res) => {
	var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    printDate = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
	var query = url.parse(req.url, true).query;
	var userName = query['userName'];
	var userEmail = query['userEmail'];
	var groupName = query['groupName'];
	var groupRef =  admin.database().ref("groups");
	var usersRef = admin.database().ref('users/'+userEmail);
	
	groupRef.child(groupName).child(userEmail).set({
				"memberName": userName 	
	});	
	usersRef.child("memberofGroup").child(groupName).set({
				"TimeJoined": printDate	
	});	
	res.send(userName);
	
});
/*
	This removes a user from Group.
	Parameters:
		userName = user to delete
		userEmail = their email
		groupName = name to delete user from.
*/
app.get('/removeFromGroup', (req, res) => {
	
	var query = url.parse(req.url, true).query;
	var userName = query['userName'];
	var userEmail = query['userEmail'];
	var groupName = query['groupName'];
	var groupRef =  admin.database().ref("groups");
	var usersRef = admin.database().ref('users/'+userEmail);	
	var updates = {}
	updates[userEmail] = null
	var updates2 = {}
	updates2[groupName] = null
	groupRef.child(groupName).update(updates);
	usersRef.child("memberofGroup").update(updates2);
	res.send(userName);
	
});


/*
	This adds a user to person's friend list.
	Need to implement checking that the friend accepts request.
	Parameters:
		friendName = the friend to be added
		userName = the person adding
		userEmail = the email of the person adding
		friendEmail = the email of the friend one is adding.
*/
app.get('/addFriend', (req, res) => {
	var query = url.parse(req.url, true).query;
	var friendName = query['friendName'];
	var userName = query['userName'];
	var userEmail = query['userEmail'];
	var friendEmail = query['friendEmail'];
	var usersRef = admin.database().ref('users/'+userEmail);
	var friendRef = admin.database().ref('users/'+friendEmail);
	var friends = usersRef.child("friends");
	
	usersRef.child("friends").child(friendEmail).set({
				"friendName" : friendName
	});
	friendRef.child("friends").child(userEmail).set({
				"friendName" : userName
	});
		
	res.send(friendName);
	
});
/* 
	Creates a user to be used later in our database
		Parameters:
			username = the username the user wants.
			email = the email of the user.
*/
app.get('/register', (req, res) =>{
	var query = url.parse(req.url, true).query;
	var username = query['username'];
	var email = query['email'];
	var randomNum =  0;
	var i;
	
	var randomArr = [];
	for (i = 0; i < 6; i++) {
		randomNum = Math.floor((Math.random() * 51) + 1);
		randomArr.push(randomNum);
	}

	labels = {};
	labels["Lying down"] = 0;
	labels["Sitting"] =0;
	labels["Standing"] =0;
	labels["Walking"] =0;
	labels["Running"] = 0;
	labels["Bicycling"] = 0;
	labels["Sleeping"] = 0;
	labels["Lab work"] = 0;
	labels["In class"] = 0;
	labels["In a meeting"] = 0;
	labels["At work"] = 0;
	labels["Indoors"] = 0;
	labels["Outside"] = 0;
	labels["In a car"] = 0;
	labels["On a bus"] = 0;
	labels["Drive – I’m the driver"] = 0;
	labels["Driver – I’m the passenger"] = 0;
	labels["At home"] = 0;
	labels["At school"] = 0;
	labels["At a restaurant"]  = 0;
	labels["Exercising"] = 0;
	labels["Cooking"]  = 0;
	labels["Shopping"]  = 0;
	labels["Strolling"]  = 0 ;
	labels["Drinking (alcohol)"] = 0;
	labels["Bathing – shower"]= 0;
	labels["Cleaning"] = 0;
	labels["Doing laundry"] = 0;
	labels["Washing dishes"] = 0;
	labels["Watching TV"] = 0;
	labels["Surfing the internet"] = 0;
	labels["At a party"] = 0;
	labels["At a bar"] = 0;
	labels["At the beach"] = 0;
	labels["Singing"] = 0;
	labels["Talking"] = 0
	labels["Computer work"] = 0;
	labels["Eating"] = 0;
	labels["Toilet"] = 0;
	labels["Grooming"] = 0;
	labels["Dressing"] = 0;
	labels["At the gym"] = 0;
	labels["Stairs – going up"] = 0;
	labels["Stairs – going down"] = 0;
	labels["Elevator"] = 0;
	labels["Phone in pocket"] = 0;
	labels["Phone in hand"] = 0 ;
	labels["Phone in bag"] = 0;
	labels["Phone on table"] = 0;
	labels["With co-workers"] = 0;
	labels["With friends"] =  0;


	
	var usersRef = db.ref('users');
	userEmail = email.replace(".", ",");
	//writes to database.
	usersRef.child(userEmail).set({
		"userName": username,
		"labels": labels,
	});
	res.send("Success")
	
	
});

/*
	grab the labels of the user to be used to update
	their information
	Parameters:
		userEmail = the email of the user to update.
*/
app.get('/readUser', (req, res) => {
	var query = url.parse(req.url, true).query;
	var usersRef = db.ref('users');
	var userEmail = query['userEmail'];
	usersRef.child(userEmail).on('value', snap => {
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