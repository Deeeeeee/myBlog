var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config-lite');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();                                                //生成一个express实例 app。

// view engine setup
app.set('views', path.join(__dirname, 'views'));                    // 设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'jade');                                     // 设置视图模板引擎为 jade

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  // 设置/public/favicon.ico为favicon图标。
app.use(bodyParser.json());                                         // 加载解析json的中间件。
app.use(bodyParser.urlencoded({extended: false}));                  // 加载解析urlencoded请求体的中间件。
app.use(cookieParser());                                            // 加载解析cookie的中间件。

app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    }),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));            // 设置public文件夹为存放静态文件的目录。

// 设置模板全局常量
app.locals.blog = {
    title: "Blog",
    description: "Blog project v1.0"
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    // res.locals.success = req.flash('success').toString();
    // res.locals.error = req.flash('error').toString();
    next();
});

// 路由控制器。
routes(app);

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

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

if( module.parent ) {
    module.exports = app;
}else{
    const port = process.env.PORT || config.port
    app.listen(port, function () {
        console.log("DeeBlog listening on port "+ config.port)
    })
}
