const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Mongoose schemas
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String
})
let userModel = mongoose.model("user",userSchema);

app.post("/api/users", async function(req,res){
  let username = req.body.username;
  let toSave = {
    username: username
  };
  let newUser = new userModel(toSave);
  await newUser.save();
  res.json(newUser);
});

const findAllUsers = (done) => {userModel.find({}, function(err, users){
  if(err) return console.log(err);
  console.log(users);
  done(null , users);
}) 
};

app.get("/api/users", async function (req,res,next){
  let users = findAllUsers();
  next();
}, async function (req,res){
  res.json();
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
