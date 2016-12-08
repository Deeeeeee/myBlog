var crypto = require('crypto');
//引入数据库模块
var UserModel = require('../models/user.js');
var Article = require('../models2/article.js');

module.exports = function (app) {

    /**
     * 首页
     */
    app.get('/', function (req, res) {
        Article.get(null, 0, 2, function (err, articles) {
            if (err) articles = [];
            res.render('index', {
                title: '首页',
                articles: articles
            });
        })
    });

    /**
     * 注册
     */
    app.get('/register', function (req, res) {
        res.render('register', {
            title: '注册'
        });
    });
    app.post('/register', function (req, res, next) {
        var username = req.body.username,
            password = req.body.password,
            rePassword = req.body.rePassword;
        // 校验参数
        try {
            if (!(username.length >= 3 && username.length <= 10)) {
                throw new Error('名字请限制在 3-10 个字符');
            }
            // if (['m', 'f', 'x'].indexOf(gender) === -1) {
            //     throw new Error('性别只能是 m、f 或 x');
            // }
            // if (!(bio.length >= 1 && bio.length <= 30)) {
            //     throw new Error('个人简介请限制在 1-30 个字符');
            // }
            // if (!req.files.avatar.name) {
            //     throw new Error('缺少头像');
            // }
            if (password.length < 6) {
                throw new Error('密码至少 6 个字符');
            }
            if (password !== rePassword) {
                throw new Error('两次输入密码不一致');
            }
        } catch (e) {
            res.json({code: 1,message:e.message});
            return
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            nPassword = md5.update(req.body.password).digest('hex');
        // 待写入数据库的用户信息
        var user={
            username: username,
            password: nPassword,
            email: req.body.email
        };
        //检查用户名是否已经存在
        UserModel.create(user)
            .then(function (result) {
                // 此 user 是插入 mongodb 后的值，包含 _id
                user = result.ops[0];
                // 将用户信息存入 session
                delete user.password;
                req.session.user = user;
                // 发送成功信息
                res.json({code: 0, message:'注册成功'});
            })
            .catch(function (e) {
                if (e.message.match('E11000 duplicate key')) {
                    res.json({code: 2, message: '用户名已被占用'});
                    return
                }
                next(e);
            })
    });

    /**
     * 登录
     */
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录'
        });
    });
    app.post('/login', function (req, res,next) {
        var username = req.body.username,
            password = req.body.password;

        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            nPassword = md5.update(password).digest('hex');
        UserModel.getUserByName(username)
            .then(function (user) {
                console.log(username)
                if (!user) {
                    res.json({code:1, message: '用户不存在'});
                    return;
                }
                // 检查密码是否匹配
                if (nPassword !== user.password) {
                    res.json({code:2, message: '用户名或密码错误'});
                    return;
                }
                res.json({code:0, message: '登录成功'});
                // 用户信息写入 session
                delete user.password;
                req.session.user = user;
            })
            .catch(next);
    });

    /**
     * 检查登陆状态
     */
    app.post('/checkLogin', function (req, res) {
        var currentUser = req.session.user;
        if (currentUser) {
            User.get(currentUser.username, function (err, user) {
                if (user) {
                    res.json({code: 0, message: "已登录，用户存在！"});
                } else {
                    res.json({code: 1, message: "用户不存在！"});
                }
            })
        } else {
            res.json({code: 2, message: "未登录！"})
        }
    });

    /**
     * 登出
     */
    app.post('/logout', function (req, res) {
        req.session.user = null;
        res.json({code: 0, message: "登录成功"});
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
                    article: articles[0]
                });
            })
        } else {
            res.render('publish', {
                title: '发布文章',
                pubType: "0"
            });
        }
    });
    app.post('/publish', function (req, res) {
        var currentUser = req.session.user,
            article = new Article(currentUser.username, req.body.title, req.body.type, req.body.content, req.body.info);
        article.save(function (err) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({code: 0, message: "发布成功"})
        });
    });

    /**
     * 更新文章
     */
    app.post('/updateArticle', function (req, res) {
        var id = req.body._id;
        var curUser = req.session.user;
        var article = new Article(curUser.username, req.body.title, req.body.content);
        article.update(id, function (err) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({code: 0, message: "文章更新成功"})
        })
    });

    /**
     * 删除文章
     */
    app.post('/removeArticle',function (req, res) {
        var id = req.body._id;
        var article = new Article();
        console.log(req.body);
        article.remove(id, function (err) {
            if (err) {
                res.json(err);
            }else{
                res.json({code: 0, message: "文章删除成功"})
            }
        })
    });

    /**
     * 文章详情
     */
    app.get('/article/:id', function (req, res) {
        var id = req.params.id;
        Article.get(id, 0, 1, function (err, articles) {
            if (err) articles = [];
            res.render('article', {
                title: '文章详情',
                articles: articles
            });
        })
    });
    app.post('/article', function (req, res) {
        var start = parseInt(req.body.start);
        var limit = parseInt(req.body.limit);
        Article.get(null, start, limit, function (err, articles) {
            if (err) {
                res.json(err)
            }else{
                res.json({
                    code: 0,
                    message: "获取成功",
                    body: articles
                });
            };
        })
    });

};