// using JavaScript Web Tokens and bCrypt:
// https://lockmedown.com/node-js-password-storage-bcrypt/
// npm install --save --save-exact bcrypt@0.8.7

const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and a password' })
  }

  // See if a user with a given email exists.
  User.findOne({ email: email }, function(err, existingUser) {

  });

  // If a user with email does exist, return an error
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' }); // unprocessable entity
    }

    // If a user with email does NOT exist, create and save user record.
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      res.json({ token: tokenForUser(user) });
    });

    // Respond to request indicating the user was created

  });
}
