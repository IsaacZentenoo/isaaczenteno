
const express = require("express");
const path = require("path");

const app = express();

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});






