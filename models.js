var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var Messages = new Schema({
  location : [Number],
  user : ObjectId,
  time : Number
});

var Users = new Schema({
  userId : String,
  name : String,
  location : [Number],
  messages : [Messages]
});

User = mongoose.model('Users', Users);
Message = mongoose.model('Messages', Messages);