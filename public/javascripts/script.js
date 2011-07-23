
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

  function init() {
    initNow();
    
    myUser = new User(now.userId, "Me", 5, 5);

    users.add(myUser);

    messages.onAdd(messageAdded);

    initChat();

    // TESTING

    var david = new User(6, "David", 5, 5);
    users.add(david);
    users.add(new User(8, "Tony", 5, 5.5));

    setTimeout(function (){
      messages.add(new Message(david.userId, "I'm david", david.lat, david.lng, new Date()));
    }, 1500);

    setInterval(updateLocation, 1000);
    setInterval(addRandomMessage, 2000);
  }

  function updateLocation() {
    console.log("Updating location => " + myUser.lat +","+myUser.lng);

    myUser.setPosition(
        myUser.lat + 0.05,
        myUser.lng + 0.05);
    
    now.move(myUser.lat, myUser.lng);
    

    render();
    popups.updatePositions();
  }

  function addRandomMessage() {
    console.log("Adding random message");

    /*messages.add(new Message(myUser.userId, "HI", myUser.lat, myUser.lng, new Date()));*/
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
      if (u == myUser)
        continue;
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

  var PopupMessagesView = Class.extend({
    init: function() {
      this.store = {}; // user ID => { model: Message object, el: DOM element }
    },
    _positionMessage: function(message, el) {
      var u = users.findById(message.userId);
      var pos = myUser.computeXY(u.lat, u.lng);
      el.css({ position: 'absolute',
        top: pos.y,
        left: pos.x
      });
    },
    showPopupMessage: function(message) {
      if (this.store[message.userId] !== undefined)
        this.store[message.userId].el.remove();

      var div = $('<div class="popup-message" />');
      div.append(message.body);

      this._positionMessage(message, div);
      $('#popup-messages').append(div);

      this.store[message.userId] = {
        model: message,
        el: div
      };
    },

    updatePositions: function() {
      for (var userid in this.store) {
        var lastMessage = this.store[userid];
        this._positionMessage(lastMessage.model, lastMessage.el);
      }
    },
  });
  var popups = new PopupMessagesView();

  function messageAdded(e) {
    var msgId = 'message-' + Math.floor(Math.random()*2147483647);
    var li = $('<li id="'+msgId+'" />');
    /*li.append(message.time+": ");*/
    li.append("("+e.message.lat+","+e.message.lng+")");
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

        if (msg) {
          console.log("SEND: "+msg);
          // TODO send to server
          messages.add(new Message(myUser.userId, msg, myUser.lat, myUser.lng, new Date()));
          now.distribute(msg);
        }

        $('#chat').val('');
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
  
  
  function initNow() {
    now.ready(initialize);
    var locationSet = false;
    $(window).bind('unload.now', function() {
      now.unloadUser();
    });
    
    now.onNearbyUsersUpdated = function (users) {
      users.clear();
      users.
    };
    
    now.broadcast = function (message) {
      
    };
  }
  
  function initialize() {
    console.log('In Initialize');
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.log("before set coord");
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
    console.log("in setCoords");
    locationSet = true;
    now.initUser(lat, lng);
    console.log("init user");
  }

  
  return {
    init: init,
  };
}();

