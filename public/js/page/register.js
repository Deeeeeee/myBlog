

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
                    password: $("#password").val().trim(),
                    rePassword: $("#rePassword").val().trim(),
                    email: $("#email").val().trim()
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/register',
                    success: function (data) {
                        if(data.code === 0){
                            alert("注册成功");
                            window.location.href="/";
                        }else{
                            alert("code:"+ data.code + " error:" + data.message)
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