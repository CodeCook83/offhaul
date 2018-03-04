// @ts-check
const _ = require('underscore');
const ImapClient = require('emailjs-imap-client').default;
const Migration = require('../models/Migration');
const Provider = require('../models/Provider');
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
  Provider.find({
      tested: true
    }).sort({
      providername: 'asc'
    })
    .then(providers => {
      const result = [];
      providers.forEach(value => {
        result.push(value.providername);
      })
      res.render('migration/imap', {
        title: title,
        providers: result
      })
    })
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
  let providername, email, password;
  let providerOld = req.query.selectOldProvider;
  let providerNew = req.query.selectNewProvider;
  let client;

  if (providerOld) {
    providername = providerOld;
    email = req.query.emailOld;
    password = req.query.passwordOld;
  } else if (providerNew) {
    providername = providerNew;
    email = req.query.emailNew;
    password = req.query.passwordNew;
  }

  Provider.findOne({
      providername: providername
    })
    .then(provider => {
      if (process.env.NODE_ENV === 'production') {
        client = new ImapClient(
          provider.incoming,
          provider.incomingPort, {
            auth: {
              user: email,
              pass: password
            }
          });
      } else {
        client = new ImapClient(
          provider.incoming,
          provider.incomingPort, {
            auth: {
              user: provider.testAccounts[0].email,
              pass: provider.testAccounts[0].password
            }
          });
      }

      client.connect()
        .then((data) => {
          res.status(200);
          res.send('Connection Ok');
        })
        .catch((err) => {
          if (err.message.startsWith('Authentication failed')) {
            res.status(200);
            res.send('Username or password are incorrect');
          } else if (err.message.startsWith('Could not open socket')) {
            res.status(200);
            res.send('Server settings are incorrect');
          } else if (err.message.startsWith(' Socket timed out')) {
            res.status(200);
            res.send('Server timed out. Check your email address');
          } else {
            res.status(200);
            res.send('Something went wrong');
          }
        })
    })
}