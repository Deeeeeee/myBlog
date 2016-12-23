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
            this.onDelArticle();
            this.onComment();
            this.onDelComment();
            this.onHideComment();
            this.onReplay();

        },

        initUserInfo: function () {
            var nickname = localStorage.getItem('commentNickname');
            var blog = localStorage.getItem('commentBlog');
            if (nickname || blog) {
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
            var html = $(".pub-comment").html();
            $(".J_replay").on("click", function () {
                var _this = $(this);
                var oFooter = _this.parent();
                if (oFooter.find('.pub-replay').length == 0) {
                    _this.text('取消回复');
                    if (_this.parents('.replay').length) {
                        var target = _this.parent().parent().find('.nickname').text();
                        console.log(target);
                        oFooter.append('<div class="pub-replay" data-target="' + target + '">' + html + '</div>');
                    } else {
                        oFooter.append('<div class="pub-replay" >' + html + '</div>');
                    }
                } else {
                    oFooter.find('.pub-replay').remove();
                    _this.text('回复');
                }
            });


            $("body").on("click", ".J_comment", function () {
                var _this = $(this);
                var parent = _this.parents('form');


                var nickname = parent.find(".nickname").val();
                var blog = parent.find(".blogAddress").val() || "";
                var content = parent.find(".commentValue").val();
                var targetId;
                var url;
                var data = {
                    target: $('.pub-replay').attr('data-target') || "",
                    nickname: nickname.trim(),
                    blog: blog.trim(),
                    content: content.trim()
                };

                if (_this.parents('.pub-comment').length) {
                    targetId = $(".title").attr("data-articleId");
                    data.articleId = targetId;
                    url = '/pubComment';
                } else if (_this.parents('.pub-replay').length) {
                    targetId = _this.parents('.comment-item').attr("data-commentId");
                    data.commentId = targetId;
                    url = '/pubReplay'
                }

                if (!localStorage.getItem('commentNickname') || (!localStorage.getItem('commentBlog') && blog)) {
                    localStorage.setItem('commentNickname', nickname);
                    localStorage.setItem('commentBlog', blog);
                }
                $.ajax({
                    type: 'post',
                    data: data,
                    url: url,
                    success: function (data) {
                        if (data.code === 0) {
                            alert(data.message);
                            window.location.reload()
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
        },

        onReplay: function () {

        }
    };
    page.init();


});