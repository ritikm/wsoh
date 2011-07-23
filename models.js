mongoose = require('mongoose');
mongoose.connect('mongo://chat:anadminpassword@localhost:27017/db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Messages = new Schema({
  location : Array,
  user : ObjectId,
  time : Number
});

var Users = new Schema({
  userId : String,
  name : String
  location : Array,
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