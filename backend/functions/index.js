
var functions = require('firebase-functions');
const express = require('express');
var url = require('url');
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const app = express();
const dbroutes = require('./routes/database.js');
var db = admin.database();



exports.writeUser = functions.https.onRequest((req, res) => {
	
		res.header('Access-Control-Allow-Origin', '*');
 	 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');	
		var query = url.parse(req.url, true).query;
		var user = "";
		var name = "";
		var password = "";
		if(query['username']){
			user = query['username'];
		}
		if(query['name']){
			name = query['name'] ;
		}
		if(query['password']){
			password = query['password'];
		}
		var usersRef = db.ref("users");	
		//  writes to database.
		usersRef.child(name).set({
  			username: user,
			password: password	
 		});
		res.send("Name of person: "+ name + " ,Username of person: "+ user+ " ,Password of person:" + password);
});
exports.readUser = functions.https.onRequest((req, res) => {
	
		res.header('Access-Control-Allow-Origin', '*');
 	 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');	
		var usersRef = admin.database().ref().child('users');
		usersRef.on('value', snap=> {
			res.send(snap.val());
		});
		
		
});
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