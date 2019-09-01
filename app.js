const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const connect_flash = require('connect-flash');
const express_messages = require('express-messages');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  helpers: {
    firstChar: function(str){
      return str.charAt(0).toUpperCase();
    },
    formatBibtex: function(str) {
      return str.replace(/[\r\n]+/g, "<br>&nbsp;&nbsp;&nbsp;&nbsp;");
    },
    ifEquals: function(val1, val2, options) {
      return (val1 === val2) ? options.fn(this) : options.inverse(this);
    },
    add: function(val1, val2){
      return parseInt(val1) + parseInt(val2);
    },
    ifNot: function(val, options){
      return (val) ? options.inverse(this) : options.fn(this);
    },
    ifOr: function(val1, val2, options){
        return (val1 || val2) ? options.fn(this) : options.inverse(this);
    },
    removeNewLine: function(val){
      return val.replace(/\n/g, "").replace(/\r/g, "");
    }
  }
});

process.env.NODE_ENV = 'development';
const config = require('./config/config.js');
const mongoose = require('mongoose');
mongoose.connect(global.config.database, { useNewUrlParser: true });
require('./config/passport_config');
const passport = require('passport');

const paper_route = require('./routes/paper/paper');
const paper_show_route = require('./routes/paper/paper_show');
const paper_create_route = require('./routes/paper/paper_create');
const paper_update_route = require('./routes/paper/paper_update');
const paper_delete_route = require('./routes/paper/paper_delete');
const paper_visible_route = require('./routes/paper/paper_visible');

const user_route = require('./routes/user/user');
const user_register_route = require('./routes/user/user_register');
const user_login_route = require('./routes/user/user_login');
const user_logout_route = require('./routes/user/user_logout');
const user_update_route = require('./routes/user/user_update');
const user_delete_route = require('./routes/user/user_delete');

const about_route = require('./routes/about');



const app = express();

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));



//express session middleware
app.use(session({
  secret: '22d6c5826b939b53',
  resave: true,
  saveUninitialized: true
}));



//express messages middleware
app.use(connect_flash());
app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});



//passport configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//every get route should have a parameter with all other surveys
app.get('*', function(req, res, next){
  res.locals.other_surveys = global.config.other_surveys;
  res.locals.contact_mail = global.config.contact_mail;
  res.locals.contact_twitter = global.config.contact_twitter;
  res.locals.cite_this_site = global.config.cite_this_site;
  next();
});



app.use('/', paper_route);
app.use('/paper/', paper_route);
app.use('/paper/show', paper_show_route);
app.use('/paper/create', paper_create_route);
app.use('/paper/update', paper_update_route);
app.use('/paper/delete', paper_delete_route);
app.use('/paper/visible', paper_visible_route);
app.use('/user/', user_route);
app.use('/user/register', user_register_route);
app.use('/user/login', user_login_route);
app.use('/user/logout', user_logout_route);
app.use('/user/update', user_update_route);
app.use('/user/delete', user_delete_route);
app.use('/about', about_route);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
