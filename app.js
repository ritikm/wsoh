/**
* Module dependencies.
*/

var express = require('express');
var util = require('util');

var async = require('async');
var _ = require('underscore');

var fs = require('fs');
var html = fs.readFileSync('index.html');

var connectedUsers = {}; // { clientId => { userId, lat, lng, name } }

var MAX_DISTANCE = 5;

var app = module.exports = express.createServer();

require('./models');

var nowjs = require("now");
var everyone = nowjs.initialize(app);

var errorCheck = function(err, data) {
  if (err) {
    console.log(data + ': ');
    console.log(util.inspect(err, true));
    return false;
  }
  
  return true;
};

everyone.now.initUser = function(lat, lng, accuracy, name) {
  console.log('In initUser');
  var that = this;
  console.log(this.user.clientId);
  
  var user = connectedUsers[this.user.clientId];
  user.lat = lat;
  user.lng = lng;
  user.name = name;
  user.isInitialized = true;
  
  giveNearbyUsersToClient(user);
};

function dist(u1, u2) {
  var y = (u1.lat - u2.lat);
  var x = (u1.lng - u2.lng);
  return Math.sqrt((y*y)+(x*x));
}

var giveNearbyUsersToClient = function (user) {
  var nearby = getNearbyUsers(user);
  /*_.each(connectedUsers, function(possibleNearbyUser) {*/
  /*if (!possibleNearbyUser.isInitialized)*/
  /*return;*/

  /*if (dist(user, possibleNearbyUser) < MAX_DISTANCE) {*/
  /*nearby.push(possibleNearbyUser);*/
  /*nowjs.getClient(possibleNearbyUser.userId, function() {*/
  /*this.now.onUserJoined(user);*/
  /*});*/
  /*}*/
  /*});*/

  nowjs.getClient(user.userId, function() {
      if (!this.now)
        return;
      this.now.onNearbyUsersUpdated(nearby);
  });
};

function getNearbyUsers(toUser) {
  return _.select(connectedUsers, function(potential) {
        if (!potential || !potential.isInitialized)
          return;

        return dist(potential, toUser) < MAX_DISTANCE;
      });
}

everyone.now.move = function(lat, lng, accuracy) {
  console.log("Client id "+this.user.clientId);

  var myUser = connectedUsers[this.user.clientId];
  if (!myUser || !myUser.isInitialized)
    return;
  myUser.lat = lat;
  myUser.lng = lng;

  giveNearbyUsersToClient(myUser); // TESTING

  // Tell our neighbors we moved.
  var nearby = getNearbyUsers(myUser);
  _.each(nearby, function (u) {
    nowjs.getClient(u.userId, function() {
      giveNearbyUsersToClient(u); // TESTING
      /*this.now.onUserMoved(myUser);*/
    });
  });
};

nowjs.on('connect', function () {
  for (var i = 0; i < 50; ++i)
    console.log("CONNECT "+  this.user.clientId);
  connectedUsers[this.user.clientId] = {
    userId: this.user.clientId,
    name: "Guest"
  };
});

nowjs.on('disconnect', function() {
  var myUser = connectedUsers[this.user.clientId];
  if (!myUser || !myUser.isInitialized)
    return;

  // tell everyone nearby that i'm gone
  var nearby = getNearbyUsers(myUser);
  _.each(nearby, function (u) {
    nowjs.getClient(u.userId, function() {
        this.now.onUserLeft(myUser);
    });
  });
});

everyone.now.sendMessage = function(text) {
  console.log('message: ' + text);
  
  var myUser = connectedUsers[this.user.clientId];
  if (!myUser || !myUser.isInitialized)
    return;

  var message = {
    userId: myUser.userId,
    text: text,
    lat: myUser.lat,
    lng: myUser.lng,
    /*time:*/
  };

  // relay the message
  var nearby = getNearbyUsers(myUser);
  _.each(nearby, function (u) {
    nowjs.getClient(u.userId, function() {
      if (this.now)
        this.now.onChatReceived(myUser, message);
    });
  });

  /*var message = new Message();*/
  /*message.location = {*/
  /*lat: connectedUsers[user.userId].lat,*/
  /*lng: connectedUsers[user.userId].lng*/
  /*}*/
  /*message.time = new Date().getTime();*/
  /*message.user = user;*/
  /*message.text = message;*/
  /*message.save();*/
};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: '2t5wgq3gq3gerg34g5hq4tbb35h' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes

app.get('/', function(req, res){
  res.end(html);
});

app.get('/jade', function(req, res) {
  res.render('index', {
    title: 'LocoChat'
  });
});

app.dynamicHelpers({
  params: function(req, res) {
    return req.params;
  },
  session: function(req, res) {
    return req.session;
  }
});

app.listen(3000);
console.log('Server listening on port %d in %s mode', app.address().port, app.settings.env);

