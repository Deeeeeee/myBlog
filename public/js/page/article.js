
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
                var title = $(".title");
                var articleId = title.attr("data-articleId");
                var authorId = title.attr("data-authorId");
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
            $(".J_comment").on("click", function () {
                var title = $(".title");
                var articleId = title.attr("data-articleId");
                var content = $("#comment").val();
                var data = {
                    articleId: articleId,
                    content: content
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/pubComment',
                    success: function (data) {
                        if (data.code === 0) {
                            alert(data.message);
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
        }
    };
    page.init();


});