
define(["jquery","upload"], function ($,upload) {
    var urlArr = [];

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
            this.onAddCategory();

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
                    type: $(".marks li.current").text(),
                    typeColor: $(".marks li.current").css("background-color"),

                    indexImg: $(".uploadWarp").find("input[type=text]").eq(0).val() || "",
                    content: $("#content").val()
                    // info: cutStr($("#content").text(),200)
                };
                if(data.type == ""){
                    alert("请选择分类");
                    return false
                }
                console.log(data);
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
        /**
         * 添加文章分类
         */
        onAddCategory: function () {
            var addBtn = $('.J_addCategory');
            var confirmBtn = $('.J_confirmAdd');
            addBtn.on('click', function () {
                var _this = $(this);
                if(!_this.hasClass('cancel')){
                    _this.before('<input type="text" id="categoryName" placeholder="添加标签"> <input type="text" id="categoryColor" placeholder="标签颜色">');
                    _this.text('取消').addClass('cancel');
                    confirmBtn.show();
                }else{
                    $("#categoryName").remove();
                    $("#categoryColor").remove();
                    _this.text('添加标签').removeClass('cancel');
                    confirmBtn.hide();
                }
            });
            confirmBtn.on('click', function () {
                var categoryName = $("#categoryName").val().trim();
                var categoryColor = $("#categoryColor").val().trim();
                var markRepeat = false;
                $(".marks li").each(function (i, v) {
                    if($(this).text() == categoryName){
                        markRepeat = true;
                        return false
                    }
                });
                if(categoryColor.substring(0,1) != '#' || categoryColor.length != 7){
                    alert("标签颜色错误");
                    return false
                }
                if(markRepeat){
                    alert("标签名称重复");
                    return false
                }
                var data = {
                    name: categoryName,
                    color: categoryColor
                };
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/addCategory',
                    success: function (data) {
                        if(data.code === 0){
                            console.log(data.message);
                            alert("标签添加成功");
                            $(".marks").append('<li style="background-color:'+categoryColor+'">'+categoryName+'</li>');
                            addBtn.trigger("click");
                        }else{
                            alert(data.message);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })
            });

            $("body").on("click", ".marks li", function () {
                $(this).addClass("current").siblings().removeClass("current");
            })
        },

        /**
         * 上传文件
         * TODO 文件压缩 类型判断
         */
        uploadFile: function () {
            $(".uploadBtn").on("change",function () {
                var _this = $(this);
                var url = '/upload';
                var promises =[];
                $.each(_this[0].files,function (i,v) {
                    var file = v;
                    var fileReader = new FileReader();
                    fileReader.onloadend = function () {
                        if (fileReader.readyState == fileReader.DONE) {
                            // document.getElementById('img').setAttribute('src', fileReader.result);
                            var html = '<li><div class="img-box"><div class="loading"></div><img src="'+fileReader.result+'" alt=""></div><input type="text" value="" readonly></li>';
                            _this.parents(".uploadBtnWarp").before(html);
                        }
                    };
                    fileReader.readAsDataURL(file);

                    // 将promise存入数组，顺序调用
                    promises.push(upload(url,i))
                });

                Promise.all(promises).then(function (res) {
                    $.each(res,function (i, v) {
                        urlArr.push(v.remoteFileUri);
                        $("#content").val($("#content").val() + "\n![image]("+ v.remoteFileUri +")\n");
                    });
                    // 文件地址赋值
                    _this.parents('.uploadBtnWarp').siblings('li').each(function (i, v) {
                        $(this).find('input').val(urlArr[i]);
                        $(this).find('.loading').fadeOut();
                    });

                },function (err) {
                    console.log(err)
                })
            });


        }

    };
    page.init();


});
