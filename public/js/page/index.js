$("#logout").on("click",function(){
    $.ajax({
        type: 'post',
        data: "",
        url: '/logout',
        success: function (data) {
            if(data.code === 0){
                alert("登出成功");
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