

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
                    nickname: $("#nickname").val().trim(),
                    // gender: $(""),
                    password: $("#password").val(),
                    rePassword: $("#rePassword").val(),
                    email: $("#email").val().trim()
                };
                if(data.username == ""){
                    alert("用户名不能为空");
                    return false
                }else if(data.password){
                    alert("密码不能为空");
                    return false
                }else if(data.rePassword){
                    alert("重复密码不能为空");
                    return false
                }else if(data.password != data.rePassword){
                    alert("两次密码不一致");
                    return false
                }else if(data.nickname == ""){
                    alert("昵称不能为空");
                    return false
                }
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/register',
                    success: function (data) {
                        if(data.code === 0){
                            alert("注册成功");
                            window.location.href="/";
                        }else{
                            console.error(data);
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