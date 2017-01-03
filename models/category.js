var Category = require('../lib/mongo').Category;

module.exports = {
    create: function (category){
        return Category.create(category).exec();
    },

    // 通过 parentId 获取分类
    getAllCategory: function(){
        return Category.find().exec();
    },

    // 通过 level 获取分类
    getCategoryByLevel: function(level){
        return Category.find({level: level}).exec();
    },
    // 通过 Id 删除分类
    delCategoryById: function(level){
        return Category.find({level: level}).exec();
    }

};
