const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || undefined;
    next();
});

require('./routes/commonTask')(app);
require('./routes/customerTask')(app);
require('./routes/productTask')(app);
require('./routes/projectTask')(app);
require('./routes/transactionTask')(app);

app.use(express.static('static'));
app.use(express.static('images'));
app.use('/images', express.static(path.join('C:/SutheoCompany/images')));

app.use((err, req,res,next) =>{
    res.end('Houston, we have a problem..');
    console.log(err);
});

const server = app.listen(process.env.PORT, function () {
    console.log("Listening on: 3000")
});
