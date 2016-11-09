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
        };
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
    });

    var pageCount = 0;
    $("#loadMore").on("click", function () {
        pageCount ++;
        var limit = 2;
        var start = pageCount * limit;
        var data = {
            limit: limit,
            start: start
        };

        $.ajax({
            type: 'post',
            data: data,
            url: '/article',
            success: function (data) {
                console.log(data);
                if(data.code === 0){
                    console.log(data.body);
                    var articles = data.body;
                    var html = "";
                    var username = $("#user").data();
                    $.each(articles, function (i, v) {
                        html += "<li>" +
                            "<h4><a href='/article/"+v._id+"'>"+v.title+"</a></h4>" +
                            "<h5>"+v.username+" || "+ v.time.minute +" || "+v.type+"</h5>" +
                            "<p>"+v.info+"</p></li>"
                    });
                    $(".article-list").append(html);
                }else{
                    console.log(data.message)
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
});