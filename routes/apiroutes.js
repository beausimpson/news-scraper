
var db = require("../models");

module.exports = function (app) {
    // saved article page
    app.get("/savedarticles", function (req, res) {
        db.Article.find({ saved: true })
            .then(function (savedArticles) {
                res.json(savedArticles);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        db.Article.find({ saved: false })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
}