
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');

var async = require('async');

var stateVars = {};

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

everyone.now.initUser = function(lat, lng) {
  console.log('In initUser');
  var that = this;
  console.log(this.user.clientId);
  
  var newUser = new User();
  
  stateVars[this.user.clientId] = {
    userId: this.user.clientId,
    lat: lat,
    lng: lng
  };
  newUser.location.lat = lat;
  newUser.location.lng = lng;
  newUser.userId = this.user.clientId;
  newUser.name = this.now.name;
  newUser.save(function(err, user) {
    if(errorCheck(err, 'User Save Error')) {
      
      nowjs.getClient(user.userId, function() {
        // console.log('doc=' + util.inspect(doc, true));
        // console.log('this.now=' + util.inspect(this.now, true));
        // console.log('doc._id=' + doc['_id']);
        // this.user
        // this.now.clientId = doc['_id'].toString();
      });
      
      giveNearbyUsersToClient(user);
      
    

  });
}
var giveNearbyUsersToClient = function (user) {
  User.find({
        location: {
          $near: [stateVars[user.userId].lat, stateVars[user.userId].lng],
          $maxDistance: 5
        },
        loggedIn: true
      }, function(err, results) {
        if (errorCheck(err, 'Database Error')) {
            // console.log('Got results');
            // console.log(util.inspect(results, true));
            nowjs.getClient(user.userId, function() {
              this.now.onNearbyUsersUpdated(results)
            });
          }
      });
    }
};

everyone.now.move = function(lat, lng) {
  
};

everyone.now.unloadUser = function() {
  User.findById(this.now.id, function (err, user) {
    if (errorCheck(err, 'Unload User Error')) {
      user.loggedIn = false;
      user.save();
    }
  });
};

everyone.now.distribute = function(message) {
  console.log('message: ' + message);
  User.find({
        location: {
          $near: [this.now.lat, this.now.lng],
          $maxDistance: 5
        },
        loggedIn: true
      }, function(err, results) {
        if (errorCheck(err, 'Database Error')) {
            console.log('Got results');
            console.log(util.inspect(results, true));
            async.forEach(results, function(element, index) {
              nowjs.getClient(element.userId, function() {
                this.now.broadcast(message);
              });
            });
          }
      });
  User.find({
      userId: this.user.clientId
  }, function (error, user) {
  var message = new Message();
  message.location = {
    lat: stateVars[user.userId].lat,
    lng: stateVars[user.userId].lng
  }
  message.time = new Date().getTime()
  message.user = user;
  message.text = message;
  message.save();
  }
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
  res.render('index', {
    title: 'Express'
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

app.listen(80);
console.log('Server listening on port %d in %s mode', app.address().port, app.settings.env);
