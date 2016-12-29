var Comment = require('../lib/mongo').Comment;
var Notifactions = require('../lib/mongo').Notifications;
module.exports = {
    // 创建一个评论
    create: function create(comment) {
        return Comment.create(comment).exec();
    },

    // 通过评论 id 删除一个评论
    delCommentById: function (commentId) {
        return Comment.remove({ _id: commentId }).exec();
    },

    // 通过评论 id 屏蔽一个评论
    hideCommentById: function (commentId, data) {
        return Comment.update({ _id: commentId },{$set: data}).exec();
    },

    // 通过评论 id 屏蔽一个评论
    readCommentById: function (commentId, data) {
        return Comment.update({ _id: commentId },{$set: data}).exec();
    },

    // 通过文章 id 删除该文章下所有评论
    delCommentsByArticleId: function (articleId) {
        return Comment.remove({ articleId: articleId }).exec();
    },

    // 通过 阅读标记 获取评论   （0 未读  1 已读）
    getCommentsByReadStatus: function (readStatus) {
        return Comment
            .find({readStatus: readStatus})
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .exec();
    },

    // 通过文章 id 获取该文章下所有评论，按评论创建时间升序
    getCommentsByArticleId: function (articleId) {
        return Comment
            .find({ articleId: articleId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
            .addCreatedAt()
            .exec();
    },

    // 通过文章 id 获取该文章下评论数
    getCommentsCount: function getCommentsCount(articleId) {
        return Comment.count({ articleId: articleId }).exec();
    },

    addReplay: function (commentId,replay){

        return Comment
            .update({ _id:commentId},{$push:replay})
            .exec();

    }
};
