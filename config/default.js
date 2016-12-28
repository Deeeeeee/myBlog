module.exports = {
    port: 3000,
    session: {
        secret: 'blog',
        key: 'blog',
        maxAge: 2592000000
    },

    mongodb: 'mongodb://127.0.0.1:27017/blog',

    // mongodb: 'mongodb://dee:admin000@ds133358.mlab.com:33358/deeblog'
    storge:{
        ACCESS_KEY:'TpziYLoGsAsk4krKqqpztKvfnPJGrlrLHMbUicOa',
        SECRET_KEY:'O26kXctAMZCvzkxjjihgE21vJZcz_WEuAthDWC8_',
        bucket :'demyblog',
        domian : 'http://oisbtzf5h.bkt.clouddn.com'
    }
};
