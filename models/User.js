const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps : true,
  toJSON : {
    virtuals: true
  }
};

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  address: {
    street: String,
    postCode: Number,
    city: String
  },
  picture: String,
  facebook: String,
  twitter: String, 
  google: String,
  gender: String
}, schemaOptions);

userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash
      next();
    })
  })
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    cb(err, isMatch);
  })
};

userSchema.virtual('gravatar').get(function () {
  if(!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

userSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;