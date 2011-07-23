
/**
 * Module dependencies.
 */

var express = require('express');
var util = require('util');

var app = module.exports = express.createServer();

require('./models');

var nowjs = require("now");
var everyone = nowjs.initialize(app);

everyone.now.initUser = function() {
  console.log('In initUser');
  this.now.userId = this.user.clientId;
  
  console.log(this.user.clientId);
  
  var newUser = new User();
  newUser.location.lat = this.now.lat;
  newUser.location.lng = this.now.lng;
  newUser.name = this.now.name;
  newUser.save(function(err) {
    if (err) {
      console.log('Database Error:');
      console.log(util.inspect(err, true));
      return;
    }
    
    Users.find({
      location: {
        $near : [this.now.lat, this.now.lng],
        $spherical : true,
        $maxDistance : 5
      },
      loggedIn: true
    }, function(err, result) {
        if (err) {
          console.log('Database Error:');
          console.log(util.inspect(err, true));
          return;
        }
        
        this.now.nearbyUsers = result;
        
        console.log(result);
    });
  });
}

everyone.now.unloadUser = function() {
  
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
