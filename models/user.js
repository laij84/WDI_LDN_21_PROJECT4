var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  passwordHash: String,
  facebookId: String,
  githubId: String,
  twitterId: String,
  avatar: String
});

userSchema.virtual('password')
.set(function(password) {
  // Save on the object, just in case we want to do anything with the value
  this._password = password;
  // Save the password hash
  this.passwordHash = bcrypt.hashSync(this._password, bcrypt.genSaltSync(8), null);
});

userSchema.virtual("passwordConfirmation")
  .get(function() {
    return this._passwordConfirmation;
  })
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.path('passwordHash')
  .validate(function(passwordHash) {
  if (this.isNew) {
    // If there has been no _password saved on the object this
    if (!this._password) {
      // Return an error message for the virtual attribute of password
      return this.invalidate('password', 'A password is required');
    }
  }
}, null);

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.set('toJSON', {
  transform: function(doc, json) {
    delete json.passwordHash;
    return json;
  }
});

module.exports = mongoose.model("User", userSchema);
