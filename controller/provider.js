// @ts-check
const _ = require('underscore');
const Provider = require('../models/Provider');
const title = 'The Porvider List';

/**
 * GET /
 */
exports.index = function (req, res) {
  Provider.find().sort({
      createdAt: 'desc'
    })
    .then(providers => {
      res.render('provider/index', {
        title: title,
        providers: providers
      });
    })
}

/**
 * PUT /addorupdate
 */
exports.addOrUpdatePut = function (req, res) {
  const newProvider = {
    incoming: req.body.incoming,
    incomingPort: req.body.incomingPort,
    outgoing: req.body.outgoing,
    outgoingPort: req.body.outgoingPort,
    tested: req.body.tested ? true : false,
    haveContacts: req.body.haveContacts ? true : false,
    haveCalendar: req.body.haveCalendar ? true : false,
    owner: req.body.owner
  };
  const options = {
    upsert: true
  };
  Provider.findOneAndUpdate({
      providername: req.body.providername
    }, newProvider, options)
    .then((result) => {
      if (result) {
        req.flash('info', {
          msg: 'Provider has been updated successfully'
        });
        res.redirect('/provider');
      } else {
        req.flash('success', {
          msg: 'Provider has been added successfully'
        });
        res.redirect('/provider');
      }
    })
    .catch(err => {
      console.log(err);
      req.flash('error', {
        msg: 'Something went wrong when updating this privoder'
      });
      res.redirect('/provider');
    })
}

/**
 * GET provider/:id
 */
exports.providerSingleGet = function (req, res) {
  Provider.findById(req.params.id)
    .then((prov) => {
      const test = JSON.stringify(prov);
      res.send(test);
    })
}

/**
 * DELETE privoder/:id
 */
exports.providerDelete = function (req, res) {
  Provider.findByIdAndRemove(req.params.id)
    .then(err => {
      req.flash('info', { msg: 'Provider has been permanently deleted.' });
      res.render('provider/index');
    })
    .catch(err => {
      console.log(err);
    })
}