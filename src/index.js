import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

//middleware
//parse application/json
app.use(bodyParser.json({
    limit: config.bodyLimit
}));

//passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//api routes v1
app.use('/api/v1', routes);

app.server.listen(config.port);
console.log('Started on port '+ app.server.address().port);

// Base URL test endpoint to see if API is running
app.get('/', (req, res) => {
    res.json({ message: 'FoodTruck API is ALIVE!' })
});

// var server = app.listen(config.port, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('running at http://' + host + ':' + port)
// });

export default app;