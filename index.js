var express = require('express');
var app = express();

app.use(express.static('static'));
app.use(express.static('images'));

var server = app.listen(3000, function () {
    console.log("Listening on: 3000")
});