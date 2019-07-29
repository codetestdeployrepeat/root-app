require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const proxy = require('http-proxy-middleware');

const indexRouter = require('./routes/index');

const app = express();

const createProxy = (path, target) => {
  app.use(path, proxy({ target, changeOrigin: true, pathRewrite: {[`^${path}`]: ''} }));
};

createProxy('/assets/micro-config', process.env.MICRO_CONFIG_URL);
createProxy('/assets/micro-deps', process.env.MICRO_DEPS_URL);
createProxy('/assets/navbar', process.env.NAVBAR_URL);
createProxy('/assets/apm', process.env.APM_URL);
createProxy('/assets/marketplace', process.env.MARKETPLACE_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use same routes for each of these for now, can be optimized later on
app.use('/', indexRouter);
app.use('/apm', indexRouter);
app.use('/marketplace', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
