define(["jquery"], function () {
    var vendor = {
        init: function () {
            this.navControl();
        },

        /**
         * 导航开关
         */
        navControl: function () {
            console.log(navs.offsetHeight)

            $(".J_navToggle").on("click", function () {
                var _this = $(this);
                var nav = $(".nav");
                var navs = nav.find('a');
                var height = navs.length * navs.offsetHeight;
                nav.css("height",height)
            })
        }
    };
    vendor.init();
});