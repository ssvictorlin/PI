
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
  TODO: Need to implement checking that the friend accepts request.
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
    
  // var randomArr = [];
  // for (i = 0; i < 6; i++) {
  // 	randomNum = Math.floor((Math.random() * 51) + 1);
  // 	randomArr.push(randomNum);
  // }

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

/*
  This will get the profile of designated user
  Parameter:
    email: the email for fetching the designated user's data
*/
app.get('/profile', (req, res) => {
  var query = url.parse(req.url, true).query;
  var email = query['email'];
  const userEmail = email.replace(".", ",");
  var usersRef = db.ref('users');
  usersRef.child(userEmail).on('value', snap => {
  const username = snap.val()['userName'];
  const labels = snap.val()['labels'];
    res.send({
      "username": username,
      "avatar": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
      "labels": labels,
    });
  });
});

app.get('/crowns', (req, res) => {
  res.send({
    "crownHolder": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
    "pieChart": "https://cdn-images-1.medium.com/max/1600/1*RSqZ9sw6-mOXAAptmvz4Dg.png"
  });
});

app.get('/dbtest', dbroutes.test);

/*
  This will choose top 5 activities with the highest probability and update user's database
  data looks like this:
  {
    "labels": [
      {"label_names":["Lying down",...,"At Work"],
       "label_probs":[0.138243573782041,...,0.4285714556235328]
      }
    ],
    "email":user.email
  }
  TODO: test successfully using postman and local server, but not on the firebase. There may be some bugs during transfer
  Parameter:
    email: the current user's email, specifying which user's data to update
    result: an array of json object read from ExtraSensory .json files
*/
app.put('/send', (req, res) => {
  const data = JSON.parse(req.body);
  const result = data['labels'];
  const email = data['email'];
  
  res.send(data);
  const userEmail = email.replace(".", ",");

  for (var j = 0; j < result.length; j++) {
    var probs = result[j]['label_probs'];
    var names = result[j]['label_names'];
    var max, maxIdx = 0;
    var top5 = [];
    // getting the top 5 activities
    for (var counter = 0; counter < 5; counter++) {
      max = 0;
      for (var i = 0; i < probs.length; i++) {
        if (probs[i] > max) {
          max = probs[i];
          maxIdx = i;
        }
      }
      top5.push(names[maxIdx]);
      // deleted the highest one so far from two arrays
      probs.splice(maxIdx, 1);
      names.splice(maxIdx, 1);
    }
    // for (var k = 0; k < 5; k++) {
    //   console.log(top5[k]);
    // }

    var usersRef = db.ref("users");
    // update database
    var updates = {};
    for (var i = 0; i < 5; i++) {
      var snap_val = 0;
      // get snapshot of current data
      usersRef.child(userEmail).child("labels").child(top5[i]).on('value', snap => {
        snap_val = snap.val();
      });
      // increment by 1
      updates[userEmail + '/labels/' + top5[i]] = snap_val + 1;
      // update command
      usersRef.update(updates);
    }
  }
  // res.send(data);
});

exports.app = functions.https.onRequest(app);