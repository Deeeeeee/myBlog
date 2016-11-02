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
                console.log("code:"+ data.code + " error:" + data.text)
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
});