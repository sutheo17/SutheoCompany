const express = require('express');
const app = express();

app.set('view engine', 'ejs');

require('./routes/commonTask')(app);
require('./routes/customerTask')(app);
require('./routes/productTask')(app);
require('./routes/projectTask')(app);

app.use(express.static('static'));
app.use(express.static('images'));

const server = app.listen(3000, function () {
    console.log("Listening on: 3000")
});