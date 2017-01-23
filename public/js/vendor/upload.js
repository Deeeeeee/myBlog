/**
 * Created by DAY on 2017/1/4.
 */
define(["exif"],function () {
    /**
     * 上传文件到 七牛
     * @param url 上传接口地址
     * @param i 多文件上传的 索引 （单文件 传0）
     */
    function upload(url, i){
        var promise = new Promise(function (resolve, reject) {
            var fileObj = document.querySelector(".uploadBtn").files; // 获取文件对象
            console.log(fileObj);
            var file = fileObj[i];

            var Orientation;
            EXIF.getData(file, function () {
                Orientation = EXIF.getTag(this, 'Orientation');
                console.log("照片方向" + Orientation);
            });
            if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;

            // 获取图片大小
            var userImgSize = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
            console.log("用户图片 : " + userImgSize);
            var reader = new FileReader();
            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;


                // 图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }

                function callback() {
                    var data = transmitCode(compress(img));
                    var formData = new FormData();
                    formData.append("file", data);
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
                                resolve(response);
                            }else{
                                reject(new Error(xhr.statusText));
                            }
                        }
                    };
                    img = null;
                }
            };
            // 读取文件内容
            reader.readAsDataURL(file);





            // 用于压缩图片的canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            // 瓦片canvas
            var tCanvas = document.createElement("canvas");
            var tctx = tCanvas.getContext("2d");

            /**
             * 图片压缩
             * @param img
             * @returns {string}
             */
            function compress(img) {
                var initSize = img.src.length;
                var width = img.width;
                var height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                var ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                switch (Orientation) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        canvas.width = height;
                        canvas.height = width;
                        break;
                    default:
                        canvas.width = width;
                        canvas.height = height;
                }
                switch (Orientation) {
                    case 3:
                        // 180 rotate left
                        ctx.translate(width, height);
                        ctx.rotate(Math.PI);
                        break;

                    case 6:
                        // 90 rotate right
                        ctx.rotate(0.5 * Math.PI);
                        ctx.translate(0, -height);
                        break;

                    case 8:
                        // 90 rotate left
                        ctx.rotate(-0.5 * Math.PI);
                        ctx.translate(-width, 0);
                        break;
                    default:
                        break;
                }
                // 铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //如果图片像素大于100万则使用瓦片绘制
                var count;
                if ((count = width * height / 1000000) > 1) {
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

                    // 计算每块瓦片的宽和高
                    var nw = ~~(width / count);
                    var nh = ~~(height / count);

                    tCanvas.width = nw;
                    tCanvas.height = nh;

                    for (var i = 0; i < count; i++) {
                        for (var j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }


                // var mpImg = new MegaPixImage(img);
                // mpImg.render(canvas, {
                //     maxWidth: 800,
                //     maxHeight: 1200,
                //     quality: 0.8,
                //     orientation: Orientation
                // });

                //进行压缩
                var ndata = canvas.toDataURL('image/jpeg', 0.4);


                console.log('压缩前：' + initSize);
                console.log('压缩后：' + ndata.length);
                console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            }

            /**
             * base64转二进制对象
             * @param baseStr
             * @returns {*}
             */
            function transmitCode(baseStr) {
                var text = window.atob(baseStr.split(",")[1]);
                var buffer = new Uint8Array(text.length);
                for (var i = 0; i < text.length; i++) {
                    buffer[i] = text.charCodeAt(i);
                }
                var blob = getBlob([buffer], file.type);

                /**
                 * 获取blob对象的兼容性写法
                 * @param buffer
                 * @param format
                 * @returns {*}
                 */
                function getBlob(buffer, format) {
                    try {
                        return new Blob(buffer, {type: format});
                    } catch (e) {
                        var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
                        buffer.forEach(function (buf) {
                            bb.append(buf);
                        });
                        return bb.getBlob(format);
                    }
                }

                return blob;
            }

        });

        return promise;
    }
    return upload;
});



