mongoose = require('mongoose');
mongoose.connect('mongo://chat:anadminpassword@localhost:27017/db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Messages = new Schema({
  location : { lat: Number, lng: Number },
  user : ObjectId,
  text: String,
  time : Number
});

var Users = new Schema({
  userId : String,
  name : String,
  location : { lat: Number, lng: Number },
  messages : [Messages],
  loggedIn : { type: Boolean, default: true, index: true }
});

Messages.index({
  location: '2d'
});

Users.index({
  location: '2d'
});

User = mongoose.model('Users', Users);
Message = mongoose.model('Messages', Messages);