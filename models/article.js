var Article = require('../lib/mongo').Article;
var marked = require('marked');
var CommentModel = require('./comment');

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

// 给 article 添加留言数 commentsCount
Article.plugin('addCommentsCount', {
    afterFind: function (articles) {
        return Promise.all(articles.map(function (article) {
            return CommentModel.getCommentsCount(article._id).then(function (commentsCount) {
                article.commentsCount = commentsCount;
                return article;
            });
        }));
    },
    afterFindOne: function (article) {
        if (article) {
            return CommentModel.getCommentsCount(article._id).then(function (count) {
                article.commentsCount = count;
                return article;
            });
        }
        return article;
    }
});

module.exports = {
    // 创建一篇文章
    create: function (article) {
        return Article.create(article).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function (articleId) {
        return Article
            .findOne({_id: articleId})
            // .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticles: function (author, start, limit) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Article
            .find(query)
            .skip(start)
            .limit(limit)
            .populate({path: 'author', model: 'User'})
            .sort({_id: -1})
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function (articleId) {
        return Article
            .update({_id: articleId}, {$inc: {pv: 1}})
            .exec();
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawArticle: function (articleId) {
        return Article
            .findOne({_id: articleId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },

    // 通过用户 id 和文章 id 更新一篇文章
    updateArticle: function (articleId, authorId, data) {
        return Article.update({authorId: authorId,_id: articleId}, {$set: data})
            .exec();
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delArticle: function (articleId, authorId) {
        return Article
            .remove({authorId: authorId, _id: articleId})
            .exec()
            .then(function (res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByArticleId(articleId);
                }
            });
    }

};
