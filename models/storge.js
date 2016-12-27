var config = require('config-lite');
var qiniu = require("qiniu");
var storgeConf = config.storge;// get storge conf  AK  SK

module.exports = {
    /*upload file*/
    upload : function (localFile,remoteFileName){
        var BUCKET = storgeConf.bucket,
            Domain = storgeConf.domian;
        //
        var result = {};
        var remoteFileUri;
        qiniu.conf.ACCESS_KEY = storgeConf.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = storgeConf.SECRET_KEY;
        var uptoken = this.uploadtoken(BUCKET,remoteFileName)
        var extra = new qiniu.io.PutExtra();
        var promise =   new Promise(function(resolve,reject){
            qiniu.io.putFile(uptoken, remoteFileName, localFile, extra, function(err, ret) {
                if(!err) {
                    // 上传成功， 处理返回值
                    var remoteFileUri = Domain+"/"+remoteFileName;
                    var result = {"code":0,"remoteFileUri":remoteFileUri};
                    resolve(result);
                    //console.log(ret.hash, ret.key, ret.persistentId);
                } else {
                    // 上传失败， 处理返回代码
                    //return result = {"code":1,"err":err};
                    reject(err);
                }

            });

        })
        return promise;
        


    },
    /*upload policy*/
    uploadtoken : function (bucket,key){
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }
}
