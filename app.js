const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const compressoion = require('compression');
const logger = require('morgan');
const methodOverride = require('method-override');


// Load Keys
const keys = require('./config/keys');

// Load Routes
const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');
const migration = require('./routes/migration');
const provider = require('./routes/provider');

// Load Passport 
require('./config/passport');

const app = express();

// Load MongoDB
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Handlebars
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    ifeq: (a, b, options) => {
      if(a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON: (object) => {
      return JSON.stringify(object);
    }
  }
}));
app.set('view engine', 'handlebars');

// Compression Init
app.use(compressoion());

// Logger Init
app.use(logger('dev'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Method-Override Init
app.use(methodOverride('_method'));

// Express Validator
app.use(expressValidator());

// Session Express Init
app.use(session({ 
  secret: keys.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

// Flash Express Init
app.use(flash());

// Password as Middleware
app.use(passport.initialize());
app.use(passport.session());

// Map user info to res.locals
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);
app.use('/user', user);
app.use('/auth', auth);
app.use('/migration', migration);
app.use('/provider', provider);

// Port info
app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () => {
  console.log(`Server started on ${app.get('port')}`);
})