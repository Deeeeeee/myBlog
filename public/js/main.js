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
                    var height = navs.length * navs[0].offsetHeight;
                    nav.css("height",height);
                }
            })
        }
    };
    vendor.init();
});

