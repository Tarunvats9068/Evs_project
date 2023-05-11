const express  = require('express');
const app = express();
const port = process.env.PORT || 9000;
const db = require('./config/mongoose');
const passport = require('passport');
const session = require('express-session');
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const flash = require('connect-flash');
const Localpassport = require('./config/localpassport');
const middleware = require('./config/middleware');
app.use(express.urlencoded());
app.use(express.static('./assets'));
app.set('view engine','ejs');
app.set('views','./views');
app.use(session({
    name : 'evs_project',
    secret: 'evs_project',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge: (1000*60*100)
    },
}));
app.use(flash());
app.use(middleware.setflash);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/',require('./routes'));
app.listen(port,function(err){
    if(err){console.log("error in running the server"); return;};
    return console.log(`server is running on url http://10.0.0.128:${port}/`) ;

});
