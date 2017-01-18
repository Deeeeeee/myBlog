var Category = require('../lib/mongo').Category;

module.exports = {
    // 添加标签
    create: function (category){
        return Category.create(category).exec();
    },

    // 获取所有标签
    getAllCategory: function(){
        return Category.find().exec();
    },

    // 获取所有标签
    getCategoryByName: function(name){
        return Category.findOne({name: name}).exec();
    },

    // 通过Id删除标签
    delCategoryById: function(id){
        return Category.find({id: id}).exec();
    }

};
