var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var session = require('express-session'); //express session
var bodyParser = require('body-parser');
var app = express();

//connect to db
var db = require('./database');

var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');
var postsRouter = require('./routes/posts');
var chatsRouter = require('./routes/chats');
var dmRouter = require('./routes/directmessages');
var blockRouter = require('./routes/blockuser');
var unblockRouter = require('./routes/unblockuser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('profilepics'));
//app.use('/profilepics', express.static('profilepics'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/posts', postsRouter);
app.use('/chats', chatsRouter);
app.use('/directMessages', dmRouter);
app.use('/blockUser', blockRouter);
app.use('/unblockUser', unblockRouter);
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
