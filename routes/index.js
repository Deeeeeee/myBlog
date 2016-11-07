var crypto = require('crypto');
//引入数据库模块
var User = require('../models/user.js');
var Article = require('../models/article.js');

module.exports = function (app) {

    app.get('/', function (req, res) {
        Article.get(null, function (err, articles) {
            if (err) articles = [];
            res.render('index', {
                title: '首页',
                articles: articles,
                user: req.session.user
            });
        })
    });

    /**
     * 注册
     */
    app.get('/register', function (req, res) {
        res.render('register', {
            title: '注册',
            user: req.session.user
        });
    });
    app.post('/register', function (req, res) {
        var username = req.body.username,
            password = req.body.password,
            rePassword = req.body.rePassword;
        //检验用户两次输入的密码是否一致
        if (rePassword != password) {
            res.json({"code": 2, "text": "两次输入的密码不一致"});
            return;
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            username: username,
            password: password,
            email: req.body.email
        });
        //检查用户名是否已经存在
        User.get(newUser.username, function (err, user) {
            if (err) {
                res.json(err);
                return;
                // return res.redirect('/');
            }
            if (user) {
                res.json({"code": 1, "text": "用户已存在"});
                return;
            }
            //如果不存在则新增用户
            newUser.save(function (err, user) {
                if (err) {
                    res.json(err);
                }
                req.session.user = newUser;//用户信息存入 session
                res.json({"code": 0, "text": "注册成功"});//注册成功后返回主页
                // return res.redirect('/login');
            });
        });
    });

    /**
     * 登录
     */
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user
        });
    });
    app.post('/login', function (req, res) {
        var username = req.body.username,
            password = req.body.password;

        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(password).digest('hex');
        User.get(username, function (err, user) {
            //检查用户名是否存在
            if (!user) {
                res.json({"code": 1, "text": "用户不存在"});
                return;
            }
            //检查密码是否正确
            if (user.password != password) {
                res.json({"code": 2, "text": "密码错误"});
                return;
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.user = user;
            res.json({"code": 0, "text": "登录成功"});
        });
    });

    /**
     * 检查登陆状态
     */
    app.post('/checkLogin', function (req, res) {
        var currentUser = req.session.user;
        if (currentUser) {
            User.get(currentUser.username, function (err, user) {
                if (user) {
                    res.json({"code": 0, "text": "已登录，用户存在！"});
                } else {
                    res.json({"code": 1, "text": "用户不存在！"});
                }
            })
        } else {
            res.json({"code": 2, "text": "未登录！"})
        }
    })

    /**
     * 登出
     */
    app.post('/logout', function (req, res) {
        req.session.user = null;
        res.json({"code": 0, "text": "登录成功"});
    });


    /**
     * 发布
     */
    app.get('/publish', function (req, res) {
        if (req.query.articleId) {
            Article.get(req.query.articleId, function (err, articles) {
                if (err) articles = [];
                res.render('publish', {
                    title: '修改文章',
                    pubType: "1",
                    user: req.session.user,
                    article: articles[0]
                });
            })
        } else {
            res.render('publish', {
                title: '发布文章',
                pubType: "0",
                user: req.session.user,
            });
        }
    });
    app.post('/publish', function (req, res) {
        var currentUser = req.session.user,
            article = new Article(currentUser.username, req.body.title, req.body.content);
        article.save(function (err) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({"code": 0, "text": "发布成功"})
        });
    });

    /**
     * 更新文章
     */
    app.post('/updateArticle', function (req, res) {
        var id = req.body._id;
        console.log(req.body)
        var curUser = req.session.user;
        var article = new Article(curUser.username, req.body.title, req.body.content);
        article.update(id, function (err) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({"code": 0, "text": "文章更新成功"})
        })
    })

};