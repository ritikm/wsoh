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
  location : { type: [Number], index: { loc: '2d' } }
  messages : [Messages]
});

mongoose.model('Users', Users);
mongoose.model('Messages', Messages);