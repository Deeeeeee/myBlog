define(["jquery"], function ($) {

    $("#logout").on("click", function () {
        $.ajax({
            type: 'post',
            data: "",
            url: '/logout',
            success: function (data) {
                if (data.code === 0) {
                    alert("退出成功");
                    window.location.href = "/";
                } else {
                    console.log("code:" + data.code + " error:" + data.text);
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
        var $this = $(this);
        if ($this.hasClass("pure-button-disabled")) return;

        $this.addClass("pure-button-disabled");
        pageCount++;
        var limit = 20;
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
                if (data.code === 0) {
                    console.log(data.body);
                    var articles = data.body;
                    var html = "";
                    var username = $("#user").data("username");
                    $.each(articles, function (i, v) {
                        /**
                         * TODO 通过用户ID判断
                         */
                        var userClass = username == v.author ? 'mine' : 'other';
                        html += "<li class='animated fadeIn'>" +
                            "<h4><a href='/article/" + v._id + "' target='_blank'>" + v.title + "</a></h4>" +
                            "<h5>" +
                            "<em>By</em>" +
                            "<span class='" + userClass + "'>" + v.author + "</span>" +
                            "<em>Under</em>" +
                            "<span class='type'>" + v.type + "</span>" +
                            "<em>On</em>" +
                            "<span class='time'>" + v.createTime + "</span>" +
                            "</h5>";
                            // +
                            // "<p>" + v.content + "</p></li>"
                    });
                    $(".article-list").append(html);

                    $this.removeClass("pure-button-disabled");

                    articles.length < limit ? $this.hide() : ""
                } else {
                    console.log(data.message)
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
});