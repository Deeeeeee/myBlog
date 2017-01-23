
define(["jquery","notie"], function ($) {
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
                        notie.alert(2,"已经登录，即将返回首页",2)
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
                            notie.alert(1,"登录成功",2);
                            setTimeout(function () {
                                window.location.href="/";
                            },2000);
                        }else{
                            console.log("code:"+ data.code + " error:" + data.message);
                            notie.alert(2,data.message,2);
                        }
                    },
                    error: function (err) {
                        notie.alert(2,err,2);
                    }
                })
            });
        }
    };
    page.init();


});