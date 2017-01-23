requirejs.config({
    baseUrl: '/js',
    // urlArgs: "version=" + new Date().getTime(),
    paths: {
        common: 'common',
        jquery: 'vendor/jquery',
        notie: 'vendor/notie',
        upload: 'vendor/upload'
    },
    shim: {

    }
});
define(["jquery"], function () {
    var vendor = {
        init: function () {
            this.navControl();
            this.logout();
        },

        /**
         * 导航开关
         */
        navControl: function () {
            $(".J_navToggle").on("click", function () {
                var _this = $(this);
                var nav = $(".nav");
                if(_this.hasClass('active')){
                    _this.removeClass('active');
                    nav.css("height",0);
                }else{
                    _this.addClass('active');
                    var navs = nav.find('a');
                    console.log(navs[0].offsetHeight);
                    var height = navs.length * navs[0].offsetHeight;
                    nav.css("height",height);
                }
            })
        },
        /**
         * 退出登录
         */
        logout: function () {
            $("#logout").on("click", function () {
                $.ajax({
                    type: 'post',
                    data: "",
                    url: '/logout',
                    success: function (data) {
                        if (data.code === 0) {
                            notie.alert(1,"退出成功",2);
                            setTimeout(function () {
                                window.location.href = "/";
                            },2000);
                        } else {
                            notie.alert(2,data.text,2);
                        }
                    },
                    error: function (err) {
                        notie.alert(3,err,2);
                    }
                })
            });
        }
    };
    vendor.init();
});

