const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '1nD*Fs9v@L0X#fA!', //TODO: REPLACE THIS
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

const server = app.listen(3000, function () {
    console.log("Listening on: 3000")
});