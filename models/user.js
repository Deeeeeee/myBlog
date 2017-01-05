var User = require('../lib/mongo').User;

module.exports = {
    // 注册一个用户
    create: function (user) {
        return User
            .create(user)
            .exec();
    },

    // 通过用户名获取用户信息
    getUserByName: function (name) {
        return User
            .findOne({ username: name })
            .addCreatedAt()
            .exec();
    },

    // 通过ID获取用户信息
    getUserById: function (id) {
        return User
            .findOne({ _id: id })
            .addCreatedAt()
            .exec();
    },

    // 通过用户 id 更新用户
    updateUserById: function (id, data) {
        return User
            .update({ _id: id }, { $set: data })
            .exec();
    }
};
