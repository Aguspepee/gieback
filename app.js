require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var AuthToken = require("./middlewares/authToken")


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const contractsRouter = require('./routes/contractsRouter');
const clientsRouter = require('./routes/clientsRouter');
const partesRouter = require('./routes/partesRouter');
const remitosRouter = require('./routes/remitosRouter');
const certificacionesRouter = require('./routes/certificacionesRouter');
const settingsRouter = require('./routes/settingsRouter');

var app = express();

//Token key generator
app.set("secretKey", "gie2022")

//CORS
app.use(cors())

//Setea la ubicación de las imagenes
app.use('/clients-images', express.static('clients-images'));
app.use('/users-images', express.static('users-images'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Se importa la función de validación del Token
app.use(AuthToken)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contracts', contractsRouter);
app.use('/clients/', clientsRouter);
app.use('/partes/', partesRouter);
app.use('/remitos/', remitosRouter);
app.use('/certificaciones/', certificacionesRouter);
app.use('/settings/', settingsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

module.exports = app;
