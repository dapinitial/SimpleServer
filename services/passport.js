const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create Local Strategy
const localOptions = { usernameField: 'email' }; // not using `username`
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  /** Verify username/password, call done with the user
    * if it is the correct username/password. Otherwise done == false;
    */
  User.findOne({ email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    // compare password /w decoded password!
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  /** Check database to see if user ID payload exists,
    * if it does, call done. Otherwise call done without a user object.
    */
  User.findById(payload.sub, function(err, user){
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
