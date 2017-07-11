var express = require('express');
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

app.use(session({secret: "I'm a nerd!"}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new FacebookStrategy({
    clientID: '120082871940211',
    clientSecret: '5a11d8b4a436c91ca0e133eb1459fe67',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, profile) {
      return done(err, profile);
    });
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/me',
    failureRedirect: '/auth/facebook'
}), function(req, res, next){
        console.log(req.session);
});

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.get('/me', function(req, res, next){
    res.send(req.user);
});

app.listen(3000, function(){
    console.log('WE HAVE EARS!');
})