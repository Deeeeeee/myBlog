

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
                    nickname: $("#nickname").val().trim(),
                    // gender: $(""),
                    password: $("#password").val(),
                    rePassword: $("#rePassword").val(),
                    email: $("#email").val().trim()
                };
                if(data.username == ""){
                    notie.alert(2,"用户名不能为空",2);
                    return false
                }else if(data.password == ""){
                    notie.alert(2,"密码不能为空",2);
                    return false
                }else if(data.rePassword == ""){
                    notie.alert(2,"重复密码不能为空",2);
                    return false
                }else if(data.password != data.rePassword){
                    notie.alert(2,"两次密码不一致",2);
                    return false
                }else if(data.nickname == ""){
                    notie.alert(2,"昵称不能为空",2);
                    return false
                }
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/register',
                    success: function (data) {
                        if(data.code === 0){
                            notie.alert(2,"注册成功",2);
                            setTimeout(function () {
                                window.location.href="/";
                            },2000);
                        }else{
                            notie.alert(2,data.message,2);

                        }
                    },
                    error: function (err) {
                        notie.alert(3,err,2);
                    }
                })
            });
        }
    };
    page.init();
});