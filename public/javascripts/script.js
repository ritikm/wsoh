
initialize();
var locationSet = false;
function initialize() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        setCoords(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
      }, 
      function() {
        handleNoGeolocation(true);
      });
  } else {
    handleNoGeolocation(false);
  }
  
  function handleNoGeolocation(browserSupportFlag) {
    now.noGeolocation = true;
    now.browserSupportFlag = browserSupportFlag;
    setCoords(37.414346, -122.076902, 16);
  }
}

function setCoords(lat, lng, accuracy) {
  now.lat = lat;
  now.lng = lng;
  now.accuracy = accuracy;
  locationSet = true;
  now.initUser();
}

var messages = [];
var myUser;

var pixels_per_degree = 100;
var Locochat = function() {
  var canvas, ctx;
  var w, h;

  var UserStore = Class.extend({
    init: function() {
      this.store = {};
    },
    findById: function(userId) {
      return this.store[userId];
    },
    add: function(user) {
      this.store[user.userId] = user;
    },
    getAll: function() {
      return this.store;
    }
  });
  var MessageStore = Class.extend({
    init: function() {
      this.store = [];
      this.ev = new EventTarget();
    },

    onAdd: function(handler) {
      this.ev.addListener("add", handler);
    },
    
    add: function(message) {
      this.store.push(message);
      this.ev.fire({type: "add", message: message});
    },
    getAll: function() {
      return this.store;
    }
  });

  var User = Class.extend({
    init: function(userId, name, lat, lng) {
      this.userId = userId;
      this.name = name;
      this.setPosition(lat,lng);
    },

    // compute XY screen coords of another geo point
    computeXY: function(otherLat, otherLng) {
      return {x: (otherLng - this.lng) * pixels_per_degree + w/2,
              y: (this.lat - otherLat) * pixels_per_degree + h/2};
    },

    setPosition: function (lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
  });
  var Message = Class.extend({
    init: function(userId, body, lat, lng, time) {
      this.userId = userId;
      this.body = body;
      this.setPosition(lat,lng);
      this.time = time;
    },

    setPosition: function (lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
  });

  var users = new UserStore();
  var messages = new MessageStore();

  function circle(ctx, ctrX, ctrY, radius) {
    ctx.beginPath();
    console.log(ctrX);
    console.log(ctrY);
    ctx.arc(ctrX, ctrY, radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  }

  function init(myUserId) {
    myUser = new User(myUserId, "Me", 5, 5);

    users.add(new User(6, "David", 5, 5));
    users.add(new User(8, "Tony", 5, 5.5));
    setInterval(updateLocation, 1000);
    setInterval(addRandomMessage, 2000);

    messages.onAdd(messageAdded);
  }

  function updateLocation() {
    console.log("Updating location => " + myUser.lat +","+myUser.lng);

    myUser.setPosition(
        myUser.lat + 0.05,
        myUser.lng + 0.05);

    render();
  }

  function addRandomMessage() {
    console.log("Adding random message");

    messages.add(new Message(myUser, "HI", myUser.lat, myUser.lng, new Date()));
  }

  function render() {
    canvas = $('#radar');
    w = canvas.width(); h = canvas.height();
    ctx = canvas[0].getContext('2d');

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "green";
    circle(ctx, w/2, h/2, 5);

    allusers = users.getAll();
    for (var userid in users.getAll()) {
      var u = users.findById(userid);
      console.log("Hi user "+userid);console.log(u);
      var pos = myUser.computeXY(u.lat, u.lng);
      ctx.fillStyle = "red";
      circle(ctx, pos.x, pos.y, 5);
    }

    allmsgs = messages.getAll();
    for (var i = 0; i < allmsgs.length; ++i) {
      var m = allmsgs[i];
      var pos = myUser.computeXY(m.lat, m.lng);
      ctx.fillStyle = "yellow";
      circle(ctx, pos.x, pos.y, 5);
    }
  }

  function messageAdded(e) {
    var msgId = 'message-' + Math.floor(Math.random()*2147483647);
    var li = $('<li id="'+msgId+'" />');
    /*li.append(message.time+": ");*/
    li.append("("+e.message.lat+","+e.message.lng+")");
    li.append(e.message.body);
    $('#message-list').append(li);
    messageArea = $('#messages');
    messageArea.scrollTop(messageArea[0].scrollHeight);
  }
  
  return {
    init: init,
  };
}();

