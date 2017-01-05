define(["jquery", "notie", "upload"], function ($, notie, upload) {
    var urlArr = [];
    var page = {
        init: function () {
            this.render();
            this.bindEvents();
        },
        render: function () {
            this.uploadFile();

        },
        bindEvents: function () {
            this.onSubmitUserInfo();
        },

        onSubmitUserInfo: function () {
            $("#submitUserInfo").on("click", function () {
                var userId = $("#user").attr("data-userId"),
                    avatar = urlArr[0],
                    nickname = $("[name=nickname]").val().trim() || "",
                    gender = $("[name=gender]:checked").val() || "",
                    age = $("[name=age]").val() || "",
                    email = $("[name=email]").val() || "",
                    phone = $("[name=phone]").val() || "";
                var data = {
                    userId: userId,
                    avatar: avatar,
                    nickname: nickname,
                    gender: gender,
                    age: age,
                    email: email,
                    phone: phone
                };
                console.log(data);
                $.ajax({
                    type: 'post',
                    data: data,
                    url: '/updateUserInfo',
                    success: function (data) {
                        if(data.code === 0){
                            alert(data.message);

                        }else{
                            alert(data.message);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
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
                            // var html = '<li><div class="img-box"><div class="loading"></div><img src="'+fileReader.result+'" alt=""></div><input type="text" value="" readonly></li>';
                            // _this.parents(".uploadBtnWarp").before(html);
                            _this.before('<div class="loading"></div>');
                            _this.siblings("img").attr("src",fileReader.result).show();
                        }
                    };
                    fileReader.readAsDataURL(file);

                    // 将promise存入数组，顺序调用
                    promises.push(upload(url,i))
                });

                Promise.all(promises).then(function (res) {
                    _this.parents('.uploadBtnWarp').find('.loading').fadeOut();
                    $.each(res,function (i, v) {
                        urlArr[i]=v.remoteFileUri;
                    });

                },function (err) {
                    console.log(err)
                })
            });
        }
    };
    page.init();


});