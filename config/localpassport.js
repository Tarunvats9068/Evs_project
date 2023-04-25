const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/user');
passport.use('local',new LocalStrategy({
    usernameField: 'email',passReqToCallback:true
},async function (req,email, password, done) {
   let user =  await Users.findOne({ email: email });
    if (!user || user.password != password || !user.verify) {
        req.flash('error','Email/Password is invalid');
        return done(null, false);
    }
    return done(null, user);
}
));

passport.serializeUser(function(user, done){
    console.log(user);
    done(null, user.id);
});
passport.deserializeUser( async function (id, done) {
   let user  = await Users.findById(id);
   if(user)
   {
    return done(null, user);
   }
   else
   {
    console.log('error in deserializer the user');
   }
});
passport.checkAuthentication =function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    return res.redirect('/login');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated())
    {
        res.locals.user = req.user;
        // res.locals.post = req.post;
        // console.log(res.locals.post);
    }
     return next();
}
module.exports = passport;