let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
//引入前台页面模块
var mine= require('./routes/home/index');
let index = require('./routes/home/mine');
let users = require('./routes/admin/users');
let posts=require('./routes/home/posts');
//引入后台页面模块
let admin=require('./routes/admin/admin');
let cats=require('./routes/admin/cats');
let article=require('./routes/admin/posts');
let about=require('./routes/admin/about')
var register=require('./routes/admin/register')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require('ejs').__express);
app.set('view engine', 'html');
//载入session模块
var session = require("express-session")
app.use(session({
    secret:'blog',
    resave:false,
    saveUninitialized:true,
    cookie:{}
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/home')));
app.use(express.static(path.join(__dirname, 'public/admin')));
//登录页面
app.use('/admin/users',users)
//前台页面路由
app.use('/', index);
app.use('/myself',mine)
app.use('/users', users);
app.use('/posts',posts);

app.use('/register',register)

//后台页面路由
app.use('/admin',checkLogin)
app.use('/admin',admin);
app.use('/admin/cats',checkLogin)
app.use('/admin/cats',cats);
app.use('/admin/posts',checkLogin);
app.use('/admin/posts',article);
app.use('/admin/about',checkLogin);
app.use('/admin/about',about)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// 编写一个中间件 用来判断是否有登录 访问的权限
function checkLogin(req,res,next){
    if(!req.session.isLogin){
        res.redirect('/admin/users')
    }
    next()
}
module.exports = app;
