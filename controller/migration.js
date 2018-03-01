// @ts-check
const _ = require('underscore');
const providerList = require('../resources/provider');
const ImapClient = require('emailjs-imap-client').default;
const Migration = require('../models/Migration');
const title = 'Main Menu';
let dataOldProvider = {};

/**
 * GET /migration/dashboard
 */
exports.dashboardGet = function (req, res) {
  Migration.find()
    .populate('user')
    .sort({
      updatedAt: 'desc'
    })
    .then((migrations) => {
      res.render('migration/dashboard', {
        title: 'Your Dashboard',
        migrations: migrations
      })
    })
};

/**
 * POST /migration/dashboard
 */
exports.dashboardPost = function (req, res) {
  res.redirect('/migration/mainmenu');
}

/**
 * GET /migration/main
 */
exports.mainGet = function (req, res) {
  return res.render('migration/mainmenu', {
    title: title
  });
}

/**
 * POST /main
 */
exports.mainPost = function (req, res) {
  res.redirect('/migration/imap');
}

/**
 * GET /imap
 */
exports.imapGet = function (req, res) {
  res.render('migration/imap', {
    title: title
  });
}

/**
 * POST /imap
 */
exports.imapPost = function (req, res) {
  res.redirect('/migration/selectFolder');
}

/**
 * GET /selectfolder
 */
exports.selectFolderGet = function (req, res) {
  let client;
  if (process.env.NODE_ENV === 'production') {
    client = new ImapClient(
      dataOldProvider.providerOld.host,
      dataOldProvider.providerOld.port, {
        auth: {
          user: dataOldProvider.providerOld.auth.user,
          pass: dataOldProvider.providerOld.auth.password
        }
      });
  } else {
    client = new ImapClient(
      dataOldProvider.providerOld.host,
      dataOldProvider.providerOld.port, {
        auth: {
          user: dataOldProvider.providerOld.auth.user_dev,
          pass: dataOldProvider.providerOld.auth.password_dev
        }
      });
  }
  client.connect().then(() => {
    client.listMailboxes().then((mailboxes) => {
      res.render('migration/selectFolder', {
        title: title,
        children: mailboxes.children
      });
    });
  });
}

/**
 * POST / selectFolder
 */
exports.selectFolderPost = function (req, res) {
  res.redirect('/migration/dashboard');
}



/**
 *  GET /testconn
 */
exports.testConnectionGet = function (req, res) {
  let provider = {};
  let providerOld = req.query.selectOldProvider;
  let providerNew = req.query.selectNewProvider;
  let client;
  _.forEach(providerList, (val, key) => {
    if (providerOld) {
      if (key === req.query.selectOldProvider) {
        provider = val;
        provider.auth.user = req.query.emailOld;
        provider.auth.password = req.query.passwordOld;
        dataOldProvider.providerOld = provider;
      }
    }
    if (providerNew) {
      if (key === req.query.selectNewProvider) {
        provider = val;
        provider.auth.user = req.query.emailNew;
        provider.auth.password = req.query.passwordNew;
        dataOldProvider.providerNew = provider;
      }
    }
  })

  if (provider) {
    if (process.env.NODE_ENV === 'production') {
      client = new ImapClient(
        provider.host,
        provider.port, {
          auth: {
            user: provider.auth.user,
            pass: provider.auth.password
          }
        });
    } else {
      client = new ImapClient(
        provider.host,
        provider.port, {
          auth: {
            user: provider.auth.user_dev,
            pass: provider.auth.password_dev
          }
        });
    }

    client.onerror = function (error) {
      console.log("**************** " + error);
      client.close()
        .then(() => {
          /* connection terminated */
        });
    }
    client.connect()
      .then((data) => {
        res.send('Connection Ok');
      })
      .catch(() => {
        res.send('Bad connection!')
      })
  }
}