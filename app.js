
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');

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
}

everyone.now.initUser = function() {
  console.log('In initUser');
  this.now.userId = this.user.clientId;
  var that = this;
  console.log(this.user.clientId);
  
  var newUser = new User();
  newUser.location.lat = this.now.lat;
  newUser.location.lng = this.now.lng;
  newUser.name = this.now.name;
  newUser.save(function(err, doc) {
    if(errorCheck(err, 'User Save Error')) {
      
      nowjs.getClient(that.now.userId, function() {
        console.log('doc=' + util.inspect(doc, true));
        console.log('this.now=' + util.inspect(this.now, true));
        console.log('doc._id=' + doc['_id']);
        this.now.clientId = doc['_id'].toString();
      });
      
      User.find({
        location: {
          $near: [that.now.lat, that.now.lng],
          $maxDistance: 5
        },
        loggedIn: true
      }, function(err, results) {
        if (errorCheck(err, 'Database Error')) {
            console.log('Got results');
            console.log(util.inspect(results, true));
            nowjs.getClient(that.now.userId, function() {
              this.now.getNearbyUsers(results)
            });
          }
      });
    }
    

  });
}

everyone.now.unloadUser = function() {
  User.findById(this.now.id, function (err, user) {
    if (errorCheck(err, 'Unload User Error')) {
      user.loggedIn = false;
      user.save();
    }
  });
};

everyone.now.distribute = function(message) {
  everyone.now.receive(this.now.name, message);
  
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
