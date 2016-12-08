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
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

exports.User = mongolass.model('User', {
    username: { type: 'string' },  //用户名
    password: { type: 'string' },   // 密码
    nickname: { type: 'string' },  // 昵称
    avatar: { type: 'string' },    // 头像
    age: {type: 'number' },         // 年龄
    gender: { type: 'number' },     // 性别
    phone: { type: 'string' },      // 电话
    email: { type: 'string' },      // 邮箱
    bio: { type: 'string' },        // 简介
    createDate: { type: 'string' }  // 创建时间
});

exports.User.index({ username: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

// exports.Post = mongolass.model('Post', {
//     author: { type: Mongolass.Types.ObjectId },
//     title: { type: 'string' },
//     content: { type: 'string' },
//     pv: { type: 'number' }
// });
// exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表
//
// exports.Comment = mongolass.model('Comment', {
//     author: { type: Mongolass.Types.ObjectId },
//     content: { type: 'string' },
//     postId: { type: Mongolass.Types.ObjectId }
// });
// exports.Post.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
// exports.Post.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言