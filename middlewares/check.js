module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            res.json({code: 0, message: '未登录'});
            // return res.redirect('/index');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            res.json({code: 0, message: '已登录'});
            // return res.redirect('back');//返回之前的页面
        }
        next();
    }
};
