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

app.get("/api/users", async function (req,res,next){
  next();
}, async function (req,res){
  userModel.find({})
      .then((data) => {
        console.log(data);
        res.json(data);
      })
      .catch((err) => res.json({ message: 'Belum ada data' }));
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
