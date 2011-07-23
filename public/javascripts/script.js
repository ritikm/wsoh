
var myUser;

var pixels_per_degree = 2000000;
var Locochat = function() {
  var canvas, ctx;
  var w, h;
  var map;

  var UserStore = Class.extend({
    init: function() {
      this.store = {};
    },
    clear: function() {
      this.store = {};
    },
    findOrLearn: function(serverUser) {
      if (! this.store[serverUser.userId]) {
        this.store[serverUser.userId] = new User(
          serverUser.userId, serverUser.name,
          serverUser.lat, serverUser.lng, serverUser.accuracy
        );
      }

      return this.store[serverUser.userId];
    },
    findById: function(userId) {
      return this.store[userId];
    },
    add: function(user) {
      this.store[user.userId] = user;
    },
    remove: function(userId) {
      delete this.store[userId];
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
    init: function(userId, name, lat, lng, accuracy) {
      this.userId = userId;
      this.name = name;
      this.setPosition(lat,lng, accuracy);
    },

    // compute XY screen coords of another geo point
    computeXY: function(otherLat, otherLng) {
      return {x: (otherLng - this.lng) * pixels_per_degree + w/2,
              y: (this.lat - otherLat) * pixels_per_degree + h/2};
    },

    setPosition: function (lat, lng, accuracy) {
      this.lat = lat;
      this.lng = lng;
      this.accuracy = accuracy;
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
    ctx.arc(ctrX, ctrY, radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
  }

  function init() {
    myUser = new User(now.userId, "Me", 5, 5);
    initNow();

    /*users.add(myUser);*/
    messages.onAdd(messageAdded);

    initChat();
    initMap();

    // TESTING

    /*var david = new User(6, "David", 5, 5);*/
    /*users.add(david);*/
    /*users.add(new User(8, "Tony", 5, 5.5));*/

    /*setTimeout(function (){*/
    /*messages.add(new Message(david.userId, "I'm david", david.lat, david.lng, new Date()));*/
    /*}, 1500);*/

    /*setInterval(mockUpdateLocation, 1000);*/
    /*setInterval(_.bind(watchLocation, {}, updateLocation), 1000);*/

    now.ready(function () {
      watchLocation(updateLocation);
      /*setInterval(addRandomMessage, 2000);*/
    });
  }

  function initMap() {
    var latlng = new google.maps.LatLng(37.4137347, -122.0777919);
    var myOptions = {
      zoom: 19,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        myOptions);
    this.markers = [];
  }

  function mockUpdateLocation() {
    updateLocation(
      myUser.lat + 0.07,
      myUser.lng - 0.05, 0.01
      /*myUser.lat + 0.05 + (Math.random() - 0.5) * 0.1,*/
      /*myUser.lng + 0.05 + (Math.random() - 0.5) * 0.1*/
    );
  }
  function updateLocation(lat, lng, accuracy) {
    myUser.setPosition(lat, lng, accuracy);
    now.move(lat, lng);

    /*render();*/
    popups.updatePositions();
  }

  function addRandomMessage() {
    /*console.log("Adding random message");*/

    /*messages.add(new Message(myUser.userId, "HI", myUser.lat, myUser.lng, new Date()));*/
  }

  function render() {
    for (var i = 0; i < this.markers.length; ++i) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
    for (var userid in users.getAll()) {
      var u = users.findById(userid);
      var mk = new google.maps.Marker({
position: new google.maps.LatLng(u.lat, u.lng),
map: map,
title: u.name
});
this.markers.push(mk);
    }


    if(false) {
      canvas = $('#radar');
      w = canvas.width(); h = canvas.height();
      ctx = canvas[0].getContext('2d');

      ctx.fillStyle = "#000033";
      ctx.fillRect(0, 0, w, h);

      allusers = users.getAll();
      for (var userid in users.getAll()) {
        var u = users.findById(userid);
        /*console.log("Hi user "+userid);console.log(u);*/
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

      ctx.fillStyle = "green";
      circle(ctx, w/2, h/2, 5);
    }
  }

  var PopupMessagesView = Class.extend({
    init: function() {
      this.store = {}; // user ID => { model: Message object, el: DOM element }
    },
    /*_positionMessage: function(message, el) {*/
    /*var u = users.findById(message.userId);*/
    /*var pos = myUser.computeXY(message.lat, message.lng);*/
    /*el.css({ position: 'absolute',*/
      /*top: pos.y,*/
      /*left: pos.x*/
      /*});*/
    /*},*/
    showPopupMessage: function(message) {
      if (this.store[message.userId] !== undefined)
        this.store[message.userId].el.setMap(null);

      var mk = new google.maps.Marker({
        position: new google.maps.LatLng(message.lat, message.lng),
        map: map,
        title: message.body
      });
      var iw = new google.maps.InfoWindow({ content: message.body});
      iw.open(map, mk);

      this.store[message.userId] = {
        model: message,
        el: mk
      };
    },

    updatePositions: function() {
                       // do nothing
    },
  });
  var popups = new PopupMessagesView();

  function messageAdded(e) {
    var msgId = 'message-' + Math.floor(Math.random()*2147483647);
    var li = $('<li id="'+msgId+'" />');
    /*li.append(message.time+": ");*/
    /*console.log(e.message.userId);*/
    /*li.append(e.message.userId + ": ");*/
    li.append("<strong>"+users.findById(e.message.userId).name + ": </strong>");
    /*li.append(users.findById(e.message.userId).lat + "  " +*/
    /*users.findById(e.message.userId).lng + " ");*/
    li.append(e.message.body);
    $('#message-list').append(li);
    messageArea = $('#messages');
    messageArea.scrollTop(messageArea[0].scrollHeight);

    popups.showPopupMessage(e.message);
  }

  function initChat() {
    $('#chat').keydown(function(e) {
      if (e.keyCode == 13) { // enter
        var msg = $('#chat').val();

        if (msg)
          sendChat(msg);

        $('#chat').val('');
        $('#theform')[0].reset();
        return false;
      } else if (e.keyCode == 27) { // escape
        $('#chat').val('');
        return false;
      }
    });
    $('#message-list').click(function() {
      $('#chat').focus();
    });
  }

  function sendChat(text) {
    console.log("SEND: "+text);
    now.sendMessage(text);

    // TESTING
    /*messages.add(new Message(myUser.userId, msg, myUser.lat, myUser.lng, new Date()));*/
  }
  
  
  function initNow() {
    now.ready(initialize);
    $(window).bind('unload.now', function() {
      now.unloadUser();
    });

    now.onUserJoined = function (serverUser) {
      console.log("User joined: "+serverUser.userId+" / "+serverUser.name);
      users.add(new User(serverUser.userId, serverUser.name,
            serverUser.lat, serverUser.lng));
    };
    now.onUserLeft = function (serverUser) {
      console.log("User left: "+serverUser.userId);
      users.remove(serverUser.userId);
    };
    now.onUserMoved = function (serverUser) {
      var u = users.findOrLearn(serverUser);
      console.log("User moved: "+serverUser.userId);
      if (u) {
        u.lat = serverUser.lat;
        u.lng = serverUser.lng;
      } else {
        console.log("Unknown user : "+serverUser.userId);
      }

      render();
    };
    
    now.onNearbyUsersUpdated = function (serverUsers) {
      console.log("Users nearby updated");
      users.clear();
      _.each(serverUsers, function(serverUser) {
          users.add(new User(serverUser.userId, serverUser.name,
              serverUser.lat, serverUser.lng));
      });

      /*var minX, maxX;*/
      /*_.each(users, function (u) {*/
      /*});*/

      render();
    };
    
    now.onChatReceived = function (serverUser, message) {
      console.log("chat from "+serverUser.userId);
      haha(message);
      messages.add(new Message(
            serverUser.userId, message.text,
            message.lat, message.lng,
            new Date()
            /*time*/
          ));
    };
  }

function haha(message) {
  if (message.text.indexOf("pix") != -1)
    message.text += '<img src="http://www.mediaevent.de/repos/2008/xhtml/stifte.jpg" />';

message.text.replace(/(https?:\/\/)?(www\.)?(youtu\.be\/|youtube\.com(\/embed\/|\/v\/|\/watch\?v=))([\w\-]{10,12})\b/,
'<object width="425" height="344"> <param name="movie" value="http://www.youtube.com/v/$5?fs=1"</param> <param name="allowFullScreen" value="true"></param> <param name="allowScriptAccess" value="always"></param> <embed src="http://www.youtube.com/v/$5?fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" width="425" height="344"> </embed> </object>');

  /*if (message.text.indexOf("http://www.youtube.com") != -1)*/
  /*message.text*/
}
  
var lastLat = 37.414346, lastLng = -122.076902, lastAcc = 16;
var lastNameUsed;
  function initialize() {
    console.log('In Initialize');

if (!lastNameUsed)
lastNameUsed = prompt("Your name?");
    now.initUser(lastLat, lastLng, lastAcc, lastNameUsed);
  }

  function watchLocation(callback) {
    if(navigator.geolocation) {
      navigator.geolocation.watchPosition(
        function(position) {
          console.log("before set coord");
lastLat = position.coords.latitude;
lastLng = position.coords.longitude;
lastAcc = position.coords.accuracy;
          callback(position.coords.latitude, position.coords.longitude, position.coords.accuracy);
        }, 
        function() { //failure
          alert("No position");
        }, {
          enableHighAccuracy: true,
          maximumAge: 1000
        });
    } else {
          alert("No position2");
          /*setCoords(37.414346, -122.076902, 16);*/
    }
  }

  
  return {
    init: init,
  };
}();

