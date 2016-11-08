define(["jquery"], function ($) {

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

    $(".J_delArticle").on("click", function () {
        var articleId = $(this).data("id");
        var data = {
            _id: articleId
        }
        $.ajax({
            type: 'post',
            data: data,
            url: '/removeArticle',
            success: function (data) {
                if(data.code === 0){
                    alert(data.text);
                    window.location.href="/";
                }else{
                    console.log("code:"+ data.code + " error:" + data.text);
                    console.log(data);
                    alert(data.text);
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

});