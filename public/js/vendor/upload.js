/**
 * Created by DAY on 2017/1/4.
 */
define([],function () {
    /**
     * 上传文件到 七牛
     * @param url 上传接口地址
     * @param i 多文件上传的 索引 （单文件 传0）
     */
    function upload(url, i){
        var promise = new Promise(function (resolve, reject) {
            var fileObj = document.querySelector(".uploadBtn").files; // 获取文件对象
            console.log(fileObj);
            var formData = new FormData();
            formData.append("file", fileObj[i]);
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
            }
        });
        return promise;
    }
    return upload;
});



