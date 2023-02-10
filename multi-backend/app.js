var createError = require('http-errors');
var express = require('express');
var path = require('path');
var passport = require('passport');
var csrf = require('csurf');
var session = require('express-session');
var MySQLStore = require('connect-mysql')(session);
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  //TODO: add cookie configuration
   /* cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    expires: 1000 * 60 * 60 * 24 * 3
  }, */ 
  store: new MySQLStore({
    config: {
      user: 'root', 
      password: 'password',
      database: 'multi-database' 
    }
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(csrf());
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});

app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
    details: err
  });
});

app.listen(5000, () => console.log('server started at port 5000'))

module.exports = app;
