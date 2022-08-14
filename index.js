const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

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
let userModel = mongooe.model("user",userSchema);

app.post("/api/users", async function(req,res,next){
  let username = req.body.username;
  console.log(username);
  let toSave = {
    username: username
  };
  let newUser = new userModel(toSave);
  await newUser.save();
  console.log(newUser);
  res.json(newUser);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
