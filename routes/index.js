var crypto = require('crypto');
var marked = require('marked');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//引入数据库模块
var UserModel = require('../models/user.js');
var ArticleModel = require('../models/article.js');
var CommentModel = require('../models/comment.js');
var StorageModel = require('../models/storage.js');
var CategoryModel = require('../models/category.js');

// 加载自定义中间件
var checkLogin = require('../middlewares/check').checkLogin;

module.exports = function (app) {

    /**
     * 首页
     */
    app.get('/', function (req, res) {
        ArticleModel.getArticles(null, 0, 20)
            .then(function (result) {


                res.render('pages/index', {
                    title: '首页',
                    articles: result
                });
            })
            .catch()
    });

    /**
     * 注册
     */
    app.get('/register', function (req, res) {
        res.render('pages/register', {
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
            res.json({code: 1, message: e.message});
            return
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            nPassword = md5.update(req.body.password).digest('hex');
        // 待写入数据库的用户信息
        var user = {
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
                res.json({code: 0, message: '注册成功'});
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
        res.render('pages/login', {
            title: '登录'
        });
    });
    app.post('/login', function (req, res, next) {
        var username = req.body.username,
            password = req.body.password;

        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            nPassword = md5.update(password).digest('hex');
        UserModel.getUserByName(username)
            .then(function (user) {
                if (!user) {
                    res.json({code: 1, message: '用户不存在'});
                    return;
                }
                // 检查密码是否匹配
                if (nPassword !== user.password) {
                    res.json({code: 2, message: '用户名或密码错误'});
                    return;
                }
                // 用户信息写入 session
                delete user.password;
                req.session.user = user;
                res.json({code: 0, message: '登录成功'});
            })
            .catch(next);
    });

    /**
     * 检查登陆状态
     */
    app.post('/checkLogin', function (req, res) {
        var currentUser = req.session.user;
        !currentUser && res.json({code: 2, message: "未登录！"})
    });

    /**
     * 登出
     */
    app.post('/logout', function (req, res) {
        req.session.user = null;
        res.json({code: 0, message: "登录成功"});
    });

    /**
     * 个人中心
     */
    app.get('/userMessage/:id', function (req, res, next) {
        CommentModel.getCommentsByReadStatus(0).then(function (result) {
            console.log(result);
            res.render('pages/userMessage', {
                title: '我的消息',
                comments: result
            });
        });
    });

    /**
     * 个人资料
     */
    app.get('/userInfo/:id', function (req, res, next) {
        var id = req.params.id;
        UserModel.getUserById(id).then(function (result) {
            console.log(result)
            res.render('pages/userInfo', {
                title: '个人资料',
                user: result
            });
        });
    });

    /**
     * 更新资料
     */
    app.post('/updateUserInfo', function (req, res, next) {
        var id = req.body.userId;
        var data = {
            avatar: req.body.avatar || "",
            nickname: req.body.nickname,
            gender: req.body.gender,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone
        };


        UserModel.updateUserById(id,data).then(function (result) {
            res.json({
                code: 0,
                message: '更新成功'
            });
        });
    });

    /**
     * 阅读评论 个人中心
     */
    app.post('/readComment', checkLogin, function (req, res) {
        var commentId = req.body.commentId;
        // var userId = req.session.user._id;
        // TODO 多人博客要验证当前用户是否是文章的 作者
        CommentModel.readCommentById(commentId, {readStatus: 1}).then(function (result) {
            res.json({code: 0, message: "屏蔽成功"});
        });
    });

    /**
     * 发布文章
     */
    app.get('/publish', function (req, res) {
        var articleId = req.query.articleId;
        if (articleId) {
            Promise.all([
                ArticleModel.getRawArticle(articleId),
                CategoryModel.getAllCategory()
            ]).then(function (results) {
                res.render('pages/publish', {
                    title: '修改文章',
                    article: results[0],
                    category: results[1]
                });
            });
        } else {
            CategoryModel.getAllCategory().then(function (result) {
                console.log(result);
                res.render('pages/publish', {
                    title: '发布文章',
                    category: result
                });
            });

        }
    });
    app.post('/publish', function (req, res, next) {
        var authorId = req.session.user._id;
        var author = req.session.user.username;
        var title = req.body.title;
        var content = req.body.content;
        var type = req.body.type;
        var typeColor = req.body.typeColor;
        // 校验参数
        try {
            if (!title.length) {
                throw new Error('请填写标题');
            }
            if (!content.length) {
                throw new Error('请填写内容');
            }
        } catch (e) {
            res.json({code: 1, message: e.message});
            return;
        }

        var data = {
            authorId: authorId,
            author: author,
            title: title,
            type: type,
            typeColor: typeColor,
            content: content,
            pv: 0
        };

        ArticleModel.create(data)
            .then(function (result) {
                // 此 post 是插入 mongodb 后的值，包含 _id
                post = result.ops[0];
                res.json({code: 0, message: '发表成功'});
            })
            .catch(next);
    });

    /**
     * 更新文章
     */
    app.post('/updateArticle', checkLogin, function (req, res) {
        var articleId = req.body.articleId;
        var authorId = req.body.authorId;
        var user = req.session.user;
        if (authorId !== user._id) {
            res.json({code: 1, message: "无权限修改此文章"});
            return
        }
        var data = {
            title: req.body.title,
            type: req.body.type,
            content: req.body.content
        };
        ArticleModel.updateArticle(articleId, user._id, data).then(function (result) {
            res.json({code: 0, message: "文章更新成功"});
        })
    });

    /**
     * 删除文章
     */
    app.post('/removeArticle', checkLogin, function (req, res) {
        var articleId = req.body.articleId;
        var authorId = req.body.authorId;
        var userId = req.session.user._id;
        if (authorId !== userId) {
            res.json({code: 1, message: "无权限删除此文章"});
            return
        }
        ArticleModel.delArticle(articleId, userId).then(function (result) {
            res.json({code: 0, message: "删除成功"});
        });
    });

    /**
     * 文章详情
     */
    app.get('/article/:id', function (req, res, next) {
        var id = req.params.id;
        Promise.all([
            ArticleModel.getArticleById(id),    // 获取文章信息
            CommentModel.getCommentsByArticleId(id),       // 获取该文章所有留言
            ArticleModel.incPv(id),              // pv 加 1
        ]).then(function (result) {
            var article = result[0];
            var comments = result[1];

            console.log(article);
            console.log(comments);

            if (!article) {
                throw new Error('该文章不存在');
            }
            res.render('pages/article', {
                title: '文章详情',
                article: article,
                comments: comments
            });
        })
            .catch(next);
    });
    app.post('/article', function (req, res) {
        var start = parseInt(req.body.start);
        var limit = parseInt(req.body.limit);
        ArticleModel.getArticles(null, start, limit)
            .then(function (result) {
                res.json({
                    code: 0,
                    message: "获取成功",
                    body: result
                });
            })
    });

    /**
     * 发布评论
     */
    app.post('/pubComment', checkLogin, function (req, res) {
        var nickname = req.body.nickname,
            articleAuthorId = req.body.articleAuthorId,
            blog = req.body.blog,
            articleId = req.body.articleId,
            content = req.body.content,
            user = req.session.user;

        try {
            //TODO 昵称验证
            if (!user && nickname == articleAuthorId) {
                throw new Error('此昵称不可用');
            }
            if (!nickname.length) {
                throw new Error('请填写昵称');
            }
            if (!articleId) {
                throw new Error('文章不存在');
            }
            if (!content.length) {
                throw new Error('请填写内容');
            }
        } catch (e) {
            res.json({code: 1, message: e.message});
            return;
        }
        var data = {
            articleId: articleId,
            nickname: nickname,
            blog: blog,
            content: content,
            status: 0,
            readStatus: 0
        };
        CommentModel.create(data)
            .then(function (result) {
                res.json({
                    code: 0,
                    message: "发布成功",
                });
            })
    });

    /**
     * 删除评论
     */
    app.post('/delComment', checkLogin, function (req, res) {
        var commentId = req.body.commentId;
        var articleAuthorId = req.body.articleAuthorId;
        var userId = req.session.user._id;
        if (userId != articleAuthorId) {
            res.json({code: 1, message: "无权限删除此评论"});
            return
        }
        CommentModel.delCommentById(commentId, userId).then(function (result) {
            res.json({code: 0, message: "删除成功"});
        });
    });

    /**
     * 屏蔽评论
     */
    app.post('/hideComment', checkLogin, function (req, res) {
        var commentId = req.body.commentId;
        var articleAuthorId = req.body.articleAuthorId;
        var userId = req.session.user._id;
        if (userId != articleAuthorId) {
            res.json({code: 1, message: "无权限屏蔽此评论"});
            return
        }
        CommentModel.hideCommentById(commentId, {status: 1}).then(function (result) {
            res.json({code: 0, message: "屏蔽成功"});
        });
    });


    /**
     * 发布回复
     */
    app.post('/pubReplay', function (req, res) {
        var target = req.body.target,//回复目标
            articleAuthor = req.body.articleAuthor,//文章作者
            nickname = req.body.nickname,//回复人
            blog = req.body.blog,//回复人博客地址
            commentId = req.body.commentId,//回复地址ID
            user = req.session.user,
            content = req.body.content;//，回复内容
        try {
            //TODO 昵称验证
            if (!user && nickname == articleAuthor) {
                throw new Error('此昵称不可用');
            }
            if (!nickname.length) {
                throw new Error('请填写昵称');
            }
            if (!commentId) {
                throw new Error('评论不存在');
            }
            if (!content.length) {
                throw new Error('请填写内容');
            }

        } catch (e) {
            res.json({code: 1, message: e.message});
            return;
        }
        var data = {
            target: target,
            nickname: nickname,
            blog: blog,
            content: content,
            status: 0
        };
        CommentModel.addReplay(commentId, {replay: data})
            .then(function (result) {
                res.json({
                    code: 0,
                    message: "发布成功",
                    body: result
                });
            })
    });

    //demo  upload
    app.post("/upload", multipartMiddleware, function (req, res) {

        var localFilePath = req.files.file.path;//本地地址
        var fileName = req.files.file.name;
        var fileType = fileName.substr(fileName.lastIndexOf('.'));
        var stamp = (new Date()).getTime();
        //上传到七牛后保存的文件名 用时间戳防止文件名重复
        // TODO 多用户下还要拼接用户ID
        var remoteFileName = stamp + fileType;
        StorageModel.upload(localFilePath, remoteFileName).then(function (remoteFileUri) {
            console.log(remoteFileUri);
            res.json(remoteFileUri)
        }, function (error) {
            console.log(error);
        });

        //构建上传策略函数
    });

    /**
     * 获取全部分类
     */
    app.post("/getAllCategory", function (req, res) {
        CategoryModel.getAllCategory().then(function (result) {
            res.json({
                code: 0,
                message: '获取全部分类成功',
                category: result
            });
        });
    });
    /**
     * 添加分类
     */
    app.post("/addCategory", function (req, res, next) {
        var name = req.body.name;
        var color = req.body.color;
        var data = {
            name: name,
            color: color
        };
        CategoryModel.create(data)
            .then(function () {
                res.json({
                    code: 0,
                    message: "添加成功"
                });
            })
            .catch(function (e) {
                console.log(e)
            })

    });



};
