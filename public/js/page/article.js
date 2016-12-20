
define(["jquery","notie"], function ($,notie) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){
            this.initUserInfo()
        },
        bindEvents: function () {
            this.onDelArticle();
            this.onComment();
            this.onDelComment();
            this.onHideComment();
        },
        initUserInfo: function () {
            var nickname = localStorage.getItem('commentNickname');
            var blog = localStorage.getItem('commentBlog');
            if(nickname || blog){
                $(".nickname").val(nickname);
                $(".blogAddress").val(blog);
            }
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
                var nickname = $(".nickname").val();
                var blog = $(".blogAddress").val() || "";
                var content = $(".commentValue").val();
                var data = {
                    articleId: articleId,
                    nickname: nickname.trim(),
                    blog: blog.trim(),
                    content: content.trim()
                };

                if(!localStorage.getItem('commentNickname') || (!localStorage.getItem('commentBlog') && blog) ){
                    localStorage.setItem('commentNickname', nickname);
                    localStorage.setItem('commentBlog', blog);
                }
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
                var articleAuthorId = $(".title").attr("data-authorId");
                var data = {
                    commentId: commentId,
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
        },
        onHideComment: function () {
            $(".J_hideComment").on("click", function () {
                var target = $(this).parents("li");
                var commentId = target.attr("data-commentId");
                var articleAuthorId = $(".title").attr("data-authorId");
                var data = {
                    commentId: commentId,
                    articleAuthorId: articleAuthorId
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/hideComment',
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