module.exports = {
    port: 3000,
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 2592000000
    },

    mongodb: 'mongodb://192.168.0.175:27017/blog'
    // mongodb: 'mongodb://dee:admin000@ds133358.mlab.com:33358/deeblog'
};