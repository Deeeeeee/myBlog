
define(["jquery","wangEditor"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){
            // this.initEditor();
            // this.initCheckLogin();
        },
        bindEvents: function () {
            this.onSubmit();
        },
        // initCheckLogin: function () {
        //     $.ajax({
        //         type: 'post',
        //         data: "",
        //         url: '/checkLogin',
        //         success: function (data) {
        //             if(data.code === 0){
        //                 // alert(data.text);
        //             }else{
        //                 alert(data.message);
        //             }
        //         },
        //         error: function (err) {
        //             console.log(err);
        //         }
        //     })
        // },

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
                    type: $("#type").val(),
                    content: $("#content").val(),
                    // info: cutStr($("#content").text(),200)
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
                            alert(data.message);
                            console.log(data);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            }
            /**
             * js截取字符串，中英文都能用
             * @param str：需要截取的字符串
             * @param len: 需要截取的长度
             */
            function cutStr(str, len) {
                var str_length = 0;
                var str_len = 0,
                    str_cut = new String();
                str_len = str.length;
                for (var i = 0; i < str_len; i++) {
                    a = str.charAt(i);
                    str_length++;
                    if (escape(a).length > 4) {
                        //中文字符的长度经编码之后大于4
                        str_length++;
                    }
                    str_cut = str_cut.concat(a);
                    if (str_length >= len) {
                        str_cut = str_cut.concat("...");
                        return str_cut;
                    }
                }
                //如果给定字符串小于指定长度，则返回源字符串；
                if (str_length < len) {
                    return str;
                }
            }
        }
    };
    page.init();


});