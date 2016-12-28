
define(["jquery"], function ($) {
    var page = {
        init: function() {
            this.render();
            this.bindEvents();
        },
        render: function(){
            // this.initEditor();
            // this.initCheckLogin();
        },
        bindEvents: function () {
            this.onSubmit();
            this.uploadFile();
        },
        onSubmit: function () {
            $("#submit").on("click",function(){
                submitArticle("/publish")
            });
            $("#update").on("click",function(){
                submitArticle("/updateArticle")
            });

            function submitArticle(url) {
                var btn = $("#update");
                var articleId = btn.attr("data-id") || "";
                var authorId = btn.attr("data-authorId") || "";
                var data = {
                    articleId: articleId,
                    authorId: authorId,
                    title: $("#title").val().trim(),
                    type: $("#type").val(),
                    content: $("#content").val()
                    // info: cutStr($("#content").text(),200)
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: url,
                    success: function (data) {
                        if(data.code === 0){
                            alert(data.message);
                            window.location.href = articleId ? ("/article/" + articleId) : "/";
                        }else{
                            alert(data.message);
                            console.log(data);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            }
            /**
             * js截取字符串，中英文都能用
             * @param str：需要截取的字符串
             * @param len: 需要截取的长度
             */
            function cutStr(str, len) {
                var str_length = 0;
                var str_len = 0,
                    str_cut = new String();
                str_len = str.length;
                for (var i = 0; i < str_len; i++) {
                    a = str.charAt(i);
                    str_length++;
                    if (escape(a).length > 4) {
                        //中文字符的长度经编码之后大于4
                        str_length++;
                    }
                    str_cut = str_cut.concat(a);
                    if (str_length >= len) {
                        str_cut = str_cut.concat("...");
                        return str_cut;
                    }
                }
                //如果给定字符串小于指定长度，则返回源字符串；
                if (str_length < len) {
                    return str;
                }
            }
        },
        uploadFile: function () {
            $(".uploadBtn").on("change",function () {
                var _this = $(this);
                var url = '/upload';
                uploadFiles(url,function (response) {
                    _this.parents(".uploadBtnWarp").before('<>')
                })
            });

            /**
             * 上传文件到 七牛
             * @param url 上传接口地址
             * @param cb
             */
            function uploadFiles(url,cb){
                var fileObj = document.querySelector(".uploadBtn").files[0]; // 获取文件对象
                var formData = new FormData();
                formData.append("file", fileObj);
                var xhr = new XMLHttpRequest();
                //监听事件
                // xhr.upload.addEventListener("progress", onprogress, false);
                // xhr.addEventListener("error", uploadFailed, false);//发送文件和表单自定义参数
                xhr.open("POST", url);
                //记得加入上传数据formData
                xhr.send(formData);
                xhr.onreadystatechange = function (e) {
                    if(xhr.readyState == 4){
                        if(xhr.status == 200) {
                            var response = JSON.parse(xhr.response);
                            console.log(response);
                            cb(response);
                        }else{
                            alert('图片上传失败');
                        }
                    }
                }
            }


        }
    };
    page.init();


});