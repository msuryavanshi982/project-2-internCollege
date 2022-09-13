const express = require('express');
const bodyParser = require('body-parser');
const {default:mongoose} = require('mongoose');
const route = require('./routes/route');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let url = " ";
let port = process.env.PORT || 3000;

mongoose.connect(url, {useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function() {
  console.log("Express app running on port " + port);
});





