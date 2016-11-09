
define(["jquery","wangEditor"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){
            this.initEditor();
            this.initCheckLogin();
        },
        bindEvents: function () {
            this.onSubmit();
        },
        initCheckLogin: function () {
            $.ajax({
                type: 'post',
                data: "",
                url: '/checkLogin',
                success: function (data) {
                    if(data.code === 0){
                        // alert(data.text);
                    }else{
                        alert(data.text);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        },

        initEditor: function () {
            var editor = new wangEditor("content");
            // 仅仅想移除某几个菜单，例如想移除『插入代码』和『全屏』菜单：
            // 其中的 wangEditor.config.menus 可获取默认情况下的菜单配置
            editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
                if (item === 'emotion') return null;
                if (item === 'video') return null;
                if (item === 'location') return null;
                return item;
            });
            editor.create();
            console.log(wangEditor.config.menus)


        },

        onSubmit: function () {
            $("#submit").on("click",function(){
                submitArticle("/publish")
            });
            $("#update").on("click",function(){
                submitArticle("/updateArticle")
            });

            function submitArticle(url) {
                var data = {
                    _id: $("#update").attr("data-id") || "",
                    title: $("#title").val().trim(),
                    content: $("#content").html()
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: url,
                    success: function (data) {
                        if(data.code === 0){
                            alert("成功");
                            window.location.href="/";
                        }else{
                            console.log("code:"+ data.code + " error:" + data.text);
                            alert(data.text);
                            console.log(data);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            }
        }
    };
    page.init();


});