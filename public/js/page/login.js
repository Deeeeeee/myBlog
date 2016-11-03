
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
                        alert("已经登录，即将返回首页")
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            })
        },
        onSubmit: function () {
            $("#submit").on("click",function(){
                var data = {
                    username: $("#username").val().trim(),
                    password: $("#password").val().trim()
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/login',
                    success: function (data) {
                        if(data.code === 0){
                            alert("登录成功");
                            window.location.href="/";
                        }else{
                            console.log("code:"+ data.code + " error:" + data.text);
                            alert(data.text);
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