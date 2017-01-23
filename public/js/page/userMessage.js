define(["jquery", "notie"], function ($, notie) {
    var page = {
        init: function () {
            this.render();
            this.bindEvents();
        },
        render: function () {
            this.initUserInfo()
        },
        bindEvents: function () {
            this.onReadComment();
        },

        initUserInfo: function () {

        },
        onReadComment: function () {
            $(".J_finishRead").on("click", function () {
                var _this = $(this);
                var commentId = _this.attr("data-id");
                var data = {
                    commentId: commentId,
                    // authorId: authorId
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/readComment',
                    success: function (data) {
                        if (data.code === 0) {
                            _this.parent().hide();
                        } else {
                            notie.alert(2,data.message,3);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            });
        }
    };
    page.init();
});