const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save Hook, encrypt password
// Before saving a model, run this function:
userSchema.pre('save', function(next) { // `pre` means before 'save' invoked, run function
  const user = this; // get access to user mode. Not required. user.email, user.password though
  // Generate a salt (takes time, so pass callback function)
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    // Hash (encrypt) password using the salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }
      // overwrite plain text password with encrypted password.
      user.password = hash;
      next(); // finish pre callback hell
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
}

// Create the Model Class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
