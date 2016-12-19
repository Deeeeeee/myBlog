var Comment = require('../lib/mongo').Comment;

module.exports = {
    // 创建一个留言
    create: function create(comment) {
        return Comment.create(comment).exec();
    },

    // 通过用户 id 和留言 id 删除一个留言
    delCommentById: function delCommentById(commentId, author) {
        return Comment.remove({ _id: commentId }).exec();
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentsByArticleId: function delCommentsByArticleId(articleId) {
        return Comment.remove({ articleId: articleId }).exec();
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments: function getComments(articleId) {
        return Comment
            .find({ articleId: articleId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
            .addCreatedAt()
            .exec();
    },

    // 通过文章 id 获取该文章下留言数
    getCommentsCount: function getCommentsCount(articleId) {
        return Comment.count({ articleId: articleId }).exec();
    }
};