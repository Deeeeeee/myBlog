
define(["jquery"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){

        },
        bindEvents: function () {
            this.onDelArticle();
            this.onComment();
            this.onDelComment();

        },
        onDelArticle: function () {
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
                var articleId = $(".title").attr("data-articleId");
                var nickname = $("#nickname").val();
                var blog = $("#blogAddress").val();
                var content = $("#comment").val();
                var data = {
                    articleId: articleId,
                    nickname: nickname,
                    blog: blog,
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
        },
        onDelComment: function () {
            $(".J_delComment").on("click", function () {
                var target = $(this).parents("li");
                var commentId = target.attr("data-commentId");
                var authorId = target.attr("data-authorId");
                var articleAuthorId = $(".title").attr("data-authorId");
                var data = {
                    commentId: commentId,
                    authorId: authorId,
                    articleAuthorId: articleAuthorId
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/delComment',
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