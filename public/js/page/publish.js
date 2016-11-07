
define(["jquery"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){
            this.renderCheckLogin();
        },
        bindEvents: function () {
            this.onSubmit();
        },
        renderCheckLogin: function () {
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
                    content: $("#content").val().trim()
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: url,
                    success: function (data) {
                        if(data.code === 0){
                            alert("文章修改成功");
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