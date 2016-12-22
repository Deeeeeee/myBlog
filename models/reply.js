var Replay = require('../lib/mongo').Replay;
module.exports = {
    /*add new replay*/
    createReplay: function (replay) {
        return Replay.create(replay).exec();
    },
    /*delete a replay  set status =1*/
    deleteReplay: function (replayId) {
        return Replay.update({ _id: replayId },{$set: 1}).exec();
    },
    /*getReplay infomation By commentId*/
    getReplay:function getReplay(CommentId){
        return Reply
            .find({ commentId: commentId })
            .sort({ _id: 1 })
            .addCreatedAt()
            .exec();
    }

}
