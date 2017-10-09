var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var Genre = require('./models/genre');

/**
 * ROUTES
 */
var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog'); //Import routes for "catalog" area of site

/**
 * Express application instance
 */
var app = express();

/**
 * Database connection mongodb
 */
var mongoose = require('mongoose');
var mongoDB = 'mongodb://local_library_root:locallibraryROOT@ds161833.mlab.com:61833/local_library';
mongoose.connect(mongoDB, {
  useMongoClient: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error!'));

/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
  customValidators: {
    genreNotExists(value, genreId) {
      console.log('app.js :: #51 value=' + value + ' , genreId=' + genreId);
      return Genre.find().isGenreExists(value, genreId).exec();
    },
  },
}));

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the module
module.exports = app;
