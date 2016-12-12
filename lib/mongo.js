var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.createTime = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.createTime = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

// 用户模块
exports.User = mongolass.model('User', {
    username: { type: 'string' },  // 用户名
    password: { type: 'string' },   // 密码
    nickname: { type: 'string' },  // 昵称
    avatar: { type: 'string' },    // 头像
    age: { type: 'number' },         // 年龄
    gender: { type: 'number' },     // 性别
    phone: { type: 'string' },      // 电话
    email: { type: 'string' },      // 邮箱
    bio: { type: 'string' }        // 简介
});
exports.User.index({ username: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

// 文章模块
exports.Article = mongolass.model('Article', {
    authorId: { type: Mongolass.Types.ObjectId },
    author: { type: 'string' },
    title: { type: 'string' },
    type: { type: 'string' },
    content: { type: 'string' },
    pv: { type: 'number' }
});
exports.Article.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

// 评论模块
exports.Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    articleId: { type: Mongolass.Types.ObjectId }
});
exports.Article.index({ articleId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Article.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言


// 回复模块
exports.Reply = mongolass.model('Reply', {
    author: {type: Mongolass.Types.ObjectId},
    content: { type: 'string' },
    CommentId: { type: Mongolass.Types.ObjectId }
});
exports.Article.index({ CommentId: 1, _id: 1 }).exec();// 通过评论 id 获取该评论下所有回复，按回复创建时间升序
exports.Article.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和回复 id 删除一个回复