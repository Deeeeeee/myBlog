module.exports = {
    port: 3000,
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 2592000000
    },

    mongodb: 'mongodb://192.168.0.105:27017/blog'
    // mongodb: 'mongodb://192.168.0.157:27017/blog'
};