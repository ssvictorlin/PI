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
    userName: The owner of the group's name.
    groupName: Name of group to create.
    groupObjective: Objective of group to create.
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
  var userName = query['userName'];
  var groupName = query['groupName'];
  var groupObjective = query['groupObjective'];
  var groupRef =  db.ref("groups")
  var ownerRef = db.ref('users/'+userEmail);

  groupRef.child(groupName).set({
    "owner": userEmail,
    "avatar": "https://api.adorable.io/avatars/250/" + groupName + ".png",
    "objective": groupObjective,
    "memberList": {[userEmail]: {"memberName": userName}},
  });
  ownerRef.once('value').then(snapshot => {
    // getting the top 3 activities of a group
    var top3 = [];
    for (var i = 0; i < 3; i++) {
      var maxProb = 0;
      var maxLabelName = '';
      for (var label in snapshot.val()['labels']) {
        if (top3.indexOf(label) > -1) {
          continue;
        }
        var labelName = label;
        var labelProb = snapshot.val()['labels'][label];
        
        if (labelProb > maxProb) {
          maxProb = labelProb;
          maxLabelName = labelName;
        } 
      }
      top3.push(maxLabelName);
    }
    groupRef.child(groupName).child('labels').set(snapshot.val()['labels']);
    groupRef.child(groupName).child('top3').set(top3);
  });

  ownerRef.child("ownerGroup").once('value').then(snapshot => {
    ownerRef.child("ownerGroup").child(groupName).set({
        "CreatedTime": printDate
    });
    ownerRef.child("memberofGroup").child(groupName).set({
      "TimeJoined": printDate	
    });	
  });
  res.send("Sucess")
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
    
  groupRef.child(groupName).child('memberList').child(userEmail).set({
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
  groupRef.child(groupName).child("memberList").update(updates);
  usersRef.child("memberofGroup").update(updates2);
  res.send(userEmail);
});

/*
  This adds a user to person's friend list.
  TODO: Need to implement checking that the friend accepts request.
  Parameters:
    friendEmail = the email of the friend one is adding.
    friendName = the friend to be added.
    userEmail = the email of the person adding.
    userName = the person adding.
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
    "avatar": 'https://api.adorable.io/avatars/250/'+ userEmail + '.png'
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
  var userEmail = query['userEmail'].replace(".", ",");

  usersRef.child(userEmail).on('value', snap => {
    res.send(snap.val());
  });
});

app.get('/fetchAllUsers', (req, res) => {
  var query = url.parse(req.url, true).query;
  var usersRef = db.ref('users');
  var userEmail = query['userEmail'].replace(".", ",");
  var userList = [];
  var curUserName = '';
  usersRef.child(userEmail).on('value', snap2 => {
    curUserName = snap2.val()['userName'];
  });

  usersRef.on('value', snap => {
    console.log(curUserName);
    snap.forEach(function(data) {
      var userObj = {};
      if (data.key !== userEmail && snap.val()[data.key]['friends'] != null) {
        userObj['userEmail'] = data.key;
        userObj['userName'] = data.val()['userName'];
        userObj['avatar'] = data.val()['avatar'];
        // userObj['memberofGroup'] = data.val()['memberofGroup'];
        // userObj['labels'] = data.val()['labels'];
        userObj['curUserName'] = curUserName;
        userObj['curUserEmail'] = userEmail;
        if (snap.val()[data.key]['friends'].hasOwnProperty(userEmail)) {
          userObj['isFriend'] = true;
        } else {
          userObj['isFriend'] = false;
        }
        userList.push(userObj);
      }
    });
    console.log(userList);
    res.send(userList);
  });
});

app.get('/fetchUsersFriends', (req, res) => {
  var query = url.parse(req.url, true).query;
  var userEmail = query['userEmail'].replace(".", ",");
  var userRef = db.ref('users');
  
  userRef.on('value', snap => {
    var friendList = [];
     for (var user in snap.val()) {
      var friendObj = {};
      if (user === userEmail || snap.val()[user]['friends'] == null) continue;
      if (snap.val()[user]['friends'].hasOwnProperty(userEmail)) {
        friendObj['userEmail'] = user;
        friendObj['userName'] = snap.val()[user]['userName'];
        friendObj['avatar'] = snap.val()[user]['avatar'];
        friendObj['memberofGroup'] = snap.val()[user]['memberofGroup'];
        friendObj['labels'] = snap.val()[user]['labels'];
        friendList.push(friendObj);
      }
    }
    res.send(friendList);
  });
});

app.get('/fetchAllGroups', (req, res) => {
  var query = url.parse(req.url, true).query;
  var userEmail = query['userEmail'].replace(".", ",");
  var groupRef = db.ref('groups');
  var userFriendRef = db.ref('users/' + userEmail + '/friends');

  var friendList = []
  userFriendRef.on('value', snap1 => { 
    for (var friendEmail in snap1.val()){
      userFriendRef.child(friendEmail).on('value', snap2 => {
        friendList.push(snap2.val()['friendName']);
      });
    }
    // console.log(friendList);
    groupRef.on('value', snap3 => {
      var result = [];
      for (var groupName in snap3.val()) {
        groupRef.child(groupName).on('value', snap4 => {
          var groupObject = {};
          var memberList = [];
          groupObject['groupName'] = groupName;
          groupObject['avatar'] = snap4.val()['avatar'];
          groupObject['objective'] = snap4.val()['objective'];
          // get member list of a group
          for (var groupMember in snap4.val()['memberList']) {
            memberList.push(snap4.val()['memberList'][groupMember]['memberName']);
          }
          // find intersection between friend list of user and member list of a group
          var intersectList = friendList.filter((n) => memberList.includes(n));
          groupObject['intersectList'] = intersectList;

          if (intersectList.length === 1) {
            groupObject['subtitle'] = intersectList[0] + ' is in this group';
          } else if (intersectList.length === 2) {
            groupObject['subtitle'] = intersectList[0] + ' and ' + intersectList[1] + ' are in this group';
          } else if (intersectList.length > 2) {
            groupObject['subtitle'] = intersectList[0] + ' and ' + intersectList[1] + 
              ' and ' + intersectList.length-2 + ' more friends are in this group';
          }

          if (snap4.val()['memberList'].hasOwnProperty(userEmail)) {
            groupObject['isJoined'] = true;
            if (intersectList.length === 0) {
              groupObject['subtitle'] = 'No friends are in this group';
            }
          } else {
            groupObject['isJoined'] = false;
            if (intersectList.length === 0) {
              groupObject['subtitle'] = 'Be the first one to join';
            }
          }

          result.push(groupObject);
        });
      }
      res.send(result);
    });
  });
});

app.get('/fetchGroupsUserIn', (req, res) => {
  var query = url.parse(req.url, true).query;
  var userEmail = query['userEmail'].replace(".", ",");
  var groupRef = db.ref('groups');

  groupRef.on('value', snap1 => {
    var groupsUserIn = [];
    for (var groupName in snap1.val()) {
      groupRef.child(groupName).on('value', snap2 => {
        var groupObject = {};
        for (var user in snap2.val()['memberList']) {
          if (user === userEmail) {
            groupObject['groupName'] = groupName;
            groupObject['avatar'] = snap2.val()['avatar'];
            groupObject['top3'] = snap2.val()['top3'];
            groupObject['objective'] = snap2.val()['objective'];
            groupsUserIn.push(groupObject);
          }
        }
      });
    }
    res.send(groupsUserIn);
  });
});

app.get('/readGroup', (req, res) => {
  var query = url.parse(req.url, true).query;
  var groupName = query['groupName'];
  var groupRef = db.ref('groups');

  groupRef.child(groupName).on('value', snap => {
    res.send(snap.val());
  });
});

/*
  This will get the profile of designated user
  Parameter:
    email: the email for fetching the designated user's data
*/
app.get('/profile', (req, res) => {
  var query = url.parse(req.url, true).query;
  var userEmail = query['email'].replace(".", ",");
  var usersRef = db.ref('users');

  usersRef.child(userEmail).on('value', snap => {
    const username = snap.val()['userName'];
    const avatar = snap.val()['avatar'];
    res.send({
      "username": username,
      "avatar": avatar,
    });
  });
});

app.get('/crowns', (req, res) => {
  res.send({
    "crownHolder": "http://farm3.static.flickr.com/2788/4132734706_da037b2754.jpg",
    "pieChart": "https://cdn-images-1.medium.com/max/1600/1*RSqZ9sw6-mOXAAptmvz4Dg.png",
    "crownIcon": "https://image.ibb.co/kna94b/icons8_crown_48.png",
  });
});

/*
  This will choose top 5 activities with the highest probability and update user's database
  TODO: Currently the user is assigned statically.
  Parameter:
    result: an array of json object read from ExtraSensory .json files
*/
app.put('/update',(req,res) => {

  const data = req.body;
  var labels = data['labels'];   
  var query = url.parse(req.url, true).query;

  var usersRef = db.ref('users');
  
  var updates = {};
  updates['labels/'] = labels;
  usersRef.child(userEmail).update(updates);
  res.send("Success");
	
});
app.put('/send', (req, res) => {
  const result = req.body;
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
    for (var k = 0; k < 5; k++) {
      console.log(top5[k]);
    }

    var usersRef = db.ref("users");
    // update database
    var updates = {};
    for (var i = 0; i < 5; i++) {
      var snap_val = 0;
      // get snapshot of current data
      usersRef.child("dkostins@ucsd,edu").child("labels").child(top5[i]).on('value', snap => {
        snap_val = snap.val();
      });
      // increment by 1
      updates['dkostins@ucsd,edu/labels/' + top5[i]] = snap_val + 1;
    }
    // update command
    usersRef.update(updates);
  }
    res.send(result);
});

exports.app = functions.https.onRequest(app);