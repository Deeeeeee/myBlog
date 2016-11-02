$("#submit").on("click",function(){
    var data = {
        title: $("#title").val().trim(),
        content: $("#content").val().trim()
    };
    $.ajax({
        type: 'post',
        data: data,
        url: '/publish',
        success: function (data) {
            if(data.code === 0){
                alert("发布成功");
                window.location.href="/";
            }else{
                console.log("code:"+ data.code + " error:" + data.text);
                alert(data.text);
                console.log(data);
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
});