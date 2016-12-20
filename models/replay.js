var Replay = require('../lib/mongo').Replay;

module.exports = {
    // 创建一个回复
    create: function (comment) {
        return Replay.create(comment).exec();
    },

    // 通过回复 id 删除一个回复
    delReplayById: function (commentId) {
        return Replay.remove({ _id: commentId }).exec();
    },

    // 通过评论 id 删除该评论下所有回复
    delReplaysByCommentId: function (articleId) {
        return Replay.remove({ articleId: articleId }).exec();
    },

    // 通过评论 id 获取该评论下所有回复，按回复创建时间升序
    getReplays: function (articleId) {
        return Replay
            .find({ articleId: articleId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
            .addCreatedAt()
            .exec();
    }

};