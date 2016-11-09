var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectID;

/**
 *
 * @param username 用户名
 * @param title {String} 文章标题
 * @param type {String} 类型
 * @param content {String} 内容
 * @param info {String} 简介
 * @constructor
 */
function Article(username, title, type, content, info) {
    this.username = username;
    this.title = title;
    this.type = type;
    this.content = content;
    this.info = info;
}

module.exports = Article;

//存储一篇文章及其相关信息
Article.prototype.save = function (callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    //要存入数据库的文档
    var article = {
        username: this.username,
        time: time,
        title: this.title,
        type: this.type,
        content: this.content,
        info: this.info

    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) return callback(err);
        //读取 articles 集合
        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档插入 articles 集合
            collection.insert(article, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

// 修改文章
Article.prototype.update = function (id, callback) {
    //要更新到数据库的文档
    var article = {
        title: this.title,
        content: this.content
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) return callback(err);
        //读取 articles 集合
        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档更新到 articles 集合
            var _id = new ObjectId(id);
            collection.update({'_id': _id}, {
                $set: {
                    "title": article.title,
                    "content": article.content
                }
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

// 删除文章
Article.prototype.remove = function (id, callback) {
    mongodb.open(function (err, db) {
        if (err)  return callback(err);
        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //将文档更新到 articles 集合
            var _id = new ObjectId(id);
            collection.remove({'_id': _id}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

//读取文章及其相关信息
Article.get = function (id, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) return callback(err);
        //读取 articles 集合
        db.collection('articles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (id) {
                query._id = new ObjectId(id);
            }
            //根据 query 对象查询文章
            collection.find(query).sort({
                time: -1
            }).skip(0).limit(10).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null, docs);//成功！以数组形式返回查询的结果
            });
        });
    });
};