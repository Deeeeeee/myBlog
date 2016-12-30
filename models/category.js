var Category = require('../lib/mongo').Category;
module.exports = {
    create : function (category){
        return Category.create(category).exec();
    },
    getList : function(){
        /*获取所有目录节点*/
        var tree = {};
        var categoryTree = Category
                            .find()
                            .exec();
        //
        console.log("categoryTree :"+categoryTree);
        var result= categoryTree.then(function(category){

            var groupTree={};
            for(var i=0;i<category.length;i++){

                if(groupTree[category[i].parentId]){
                    groupTree[category[i].parentId].push(category[i]);
                }else{
                    groupTree[category[i].parentId]=[];
                    groupTree[category[i].parentId].push(category[i]);
                }
            }
            return groupTree;
        });

        return result;


    }

};
