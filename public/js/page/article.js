
define(["jquery"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){

        },
        bindEvents: function () {
            this.onDel();
            this.onComment();
        },
        onDel: function () {
            $(".J_delArticle").on("click", function () {
                var articleId = $(this).attr("data-articleId");
                var authorId = $(".sub-title").attr("data-authorId");
                var data = {
                    articleId: articleId,
                    authorId: authorId
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/removeArticle',
                    success: function (data) {
                        if (data.code === 0) {
                            alert(data.message);
                            window.location.href = "/";
                        } else {
                            console.log(data);
                            alert(data.message);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            });
        },
        onComment: function () {

        }
    };
    page.init();


});