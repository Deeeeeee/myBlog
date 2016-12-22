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
    password: { type: 'string' },   // 密码  md5加密
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
    modifydate:{type:'number'}//时间  Unix timestamp
});
exports.Article.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

// 评论模块
exports.Comment = mongolass.model('Comment', {
    id:{type:type: Mongolass.Types.ObjectId},
    nickname: { type: 'string' },
    blog: {type: 'string'},
    content: { type: 'string' },
    articleId: { type: Mongolass.Types.ObjectId },//Article Id
    status: {type: 'number'}     // 状态： 0正常 1屏蔽
    entrydate:{type:'number'} //发表时间   timestamp
    modifydate:{type:'number'}//发表时间  timestamp
});
exports.Article.index({ articleId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Article.index({ _id: 1 }).exec();// 通过评论 id 删除一个留言


// 回复模块
exports.Reply = mongolass.model('Reply', {
    id:{type: Mongolass.Types.ObjectId},
    nickname: { type: 'string' },
    blog: {type: 'string'},
    content: { type: 'string' },
    replyId: { type: Mongolass.Types.ObjectId },//connect to Comment.
    status: {type: 'number'}     // 状态： 0正常 1屏蔽
    modifydate:{type:'number'}//发表时间  timestamp
});
exports.Comment.index({ ReplayId: 1, _id: 1 }).exec();// 通过评论 id 获取该评论下所有回复，按回复创建时间升序
exports.Comment.index({ _id: 1 }).exec();// 通过用户 id 和回复 id 删除一个回复
