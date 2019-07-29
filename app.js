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

createProxy('/assets/micro-config', 'http://localhost:8401/assets/micro-config');
createProxy('/assets/micro-deps', 'http://localhost:8402/assets/micro-deps');
createProxy('/assets/navbar', 'http://localhost:8403/assets/navbar');
createProxy('/assets/apm', 'http://localhost:8404/assets/apm');
createProxy('/assets/marketplace', 'http://localhost:8405/assets/marketplace');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
