var Article = require('../lib/mongo').Article;
var marked = require('marked');

// 将 article 的 content 从 markdown 转换成 html
Article.plugin('contentToHtml', {
    afterFind: function (articles) {
        return articles.map(function (article) {
            article.content = marked(article.content);
            return article;
        });
    },
    afterFindOne: function (article) {
        if (article) {
            article.content = marked(article.content);
        }
        return article;
    }
});
module.exports = {
    // 创建一篇文章
    create: function create(article) {
        return Article.create(article).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function getArticleById(articleId) {
        return Article
            .findOne({ _id: articleId })
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticles: function getArticles(author,start,limit) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Article
            .find(query)
            .skip(start)
            .limit(limit)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(articleId) {
        return Article
            .update({ _id: articleId }, { $inc: { pv: 1 } })
            .exec();
    }
};