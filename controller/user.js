const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async');
const User = require('../models/User');
const keys = require('../config/keys');

exports.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/user/login');
  }
}

/**
 * GET /login
 */
exports.loginGet = function (req, res) {
  if (req.user) {
    return res.redirect('/migration/dashboard');
  }
  res.render('account/login')
}

/**
 * POST /login
 */
exports.loginPost = function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/user/login');
  }

  // tmp email for name passing via handlebars
  const tmpEmail = req.body.email;

  passport.authenticate('local', function (err, user, info) {
    if (!user) {
      req.flash('error', info);
      return res.render('account/login', {
        email: tmpEmail
      })
    }
    req.logIn(user, function (err) {
      res.redirect('/migration/dashboard');
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function (req, res) {
  req.logout();
  req.flash('info', { msg: 'You have successfully logged out' });
  res.redirect('/');
}

/**
 * GET: /signup
 */

exports.signupGet = function (req, res) {
  if (req.user) {
    return res.redirect('/migration/dashboard');
  }
  res.render('account/signup', {
    title: 'Sign up'
  });
};

/**
 * POST: /signup
 */
exports.signupPost = function (req, res) {
  req.sanitize('email').normalizeEmail({
    remove_dots: false,
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.assert('name', 'Name connot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Passwprd mus be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords must match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.render('account/signup', {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        req.flash('error', { msg: 'Email already registerd' });
        res.redirect('/user/signup');
      } else {
        user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        user.save()
          .then(user => {
            req.flash('success', { msg: 'You have successfully registered ' });
            req.logIn(user, err => {
              res.redirect('/migration/dashboard');
            })
          })
          .catch(err => {
            console.error(err);
            return;
          });
      }
    })
}

/**
 * GET /forgot
 */
exports.forgotGet = function (req, res) {
  if (req.isAuthenticated()) {
    return res.render('migration/dashboard');
  } else {
    res.render('account/forgot', {
      title: 'Forgot Password?'
    })
  }
}

/**
 * POST /forgot
 */
exports.forgotPost = function (req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({
    remove_dots: false,
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/user/forgot');
  }
  async.waterfall([
    (done) => {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      })
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', { msg: `The email address ${req.body.email} is not associated with any account.` });
          return res.redirect('/user/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 86400000; // one day
        user.save((err) => {
          done(err, token, user);
        })
      })
    },
    (token, user, done) => {
      const transporter = nodemailer.createTransport({
        host: keys.mailServer,
        secure: true,
        auth: {
          user: keys.mailUser,
          pass: keys.mailPassword
        }
      });
      const mailOptions = {
        to: user.email,
        from: keys.mailUser,
        subject: '✔ Reset your password on MigMia',
        text: `Hi,

Thanks for using offhaul! You are receiving this email because you (or someone else) have requested the reset of the password for your account.

Please click on the following link, or paste this into your browser to complete the process:

http://${req.headers.host}/user/reset/${token}
        
If you did not request this, please ignore this email and your password will remain unchanged.
        
The offhaul team`
      };
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          req.flash('info', { msg: `An email has been sent to '${user.email}' with further instructions.` });
          res.redirect('/user/forgot');
        }
      })
    }
  ]);
}

/**
 * GET /reset
 */
exports.resetGet = function (req, res) {


  if (req.isAuthenticated()) {
    return res.redirect('/migration/dashboard');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (!user) {
        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    })
};

/**
 * POST /reset
 */
exports.resetPost = function (req, res) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords must match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('back');
  }
  async.waterfall([
    (done) => {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (!user) {
            req.flash('error', { mag: 'Password reset token is invalid or has expired.' });
            return redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(err => {
            req.logIn(user, (err) => {
              done(err, user);
            })
          })
        });
    },
    (user, done) => {
      const transporter = nodemailer.createTransport({
        host: keys.mailServer,
        secure: true,
        auth: {
          user: keys.mailUser,
          pass: keys.mailPassword
        }
      });
      const mailOptions = {
        from: keys.mailUser,
        to: user.email,
        subject: 'Your offhaul password has been reseted',
        text: `Hi

This is a confirmation that the password for your account '${user.email}' has just been changed.

The offhaul team`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('success', { msg: 'Your password has been changed successfully.' });
        res.redirect('/migration/dashboard');
      })
    }
  ]);
}

/**
 * GET /account
 */
exports.accountGet = function (req, res) {
  res.render('account/profile', {
    title: 'My profile data'
  })
}

/**
 * PUT /account
 * Update profile information OR change password
 */
exports.accountPut = function (req, res) {
  if ('newPassword' in req.body) {
    req.assert('newPassword', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords must match').equals(req.body.newPassword);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({
      remove_dots: false,
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });
  }

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', { errors });
    res.redirect('/user/account');
  }

  User.findById(req.user.id, (err, user) => {
    if ('newPassword' in req.body) {
      user.password = req.body.newPassword;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
      user.gender = req.body.gender;
      user.address.street = req.body.street;
      user.address.postCode = req.body.postCode;
      user.address.city = req.body.city;
    }
    user.save(err => {
      if ('newPassword' in req.body) {
        req.flash('success', { msg: 'Your password has been changed' });
      } else if (err && err.code === 11000) {
        req.flash('error', { msg: 'The email address you have entered is already associated with another account.' });
      } else {
        req.flash('success', { msg: 'Your profile information has been updated.' });
      }
      res.redirect('/user/account');
    })
  })
}

/**
 * DELETE /account
 */
exports.accountDelete = function (req, res) {
  User.remove({ _id: req.user.id })
    .then(err => {
      req.logout();
      req.flash('info', { msg: 'Your account has been permanently deleted.' });
      res.redirect('/');
    });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function (req, res) {
  User.findById(req.user.id, (err, user) => {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      default:
        req.flash('error', { msg: 'Invalid OAuth Provider' });
        return res.redirect('/user/account');
    }
    user.save((err) => {
      req.flash('success', { msg: 'Your account has been unlinked.' });
      res.redirect('/user/account');
    })
  })
}