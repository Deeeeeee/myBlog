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

    // 通过文章 id 删除该文章下所有评论
    delCommentsByArticleId: function (articleId) {
        return Comment.remove({ articleId: articleId }).exec();
    },

    getComments: function () {
        return Comment
            .find()
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
