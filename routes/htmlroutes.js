
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

    // home page
    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/saved", function (req, res) {
        res.render("saved");
    });


    app.get("/scrape", function (req, res) {
        axios.get("https://www.npr.org/").then(function (response) {

            var $ = cheerio.load(response.data);

            $(".story-text").each(function (i, element) {
                var result = {};

                result.title = $(this)
                .children("a")
                .children("h3.title")
                .text();
                result.link = $(this)
                .children("a")
                .attr("href");
                result.summary = $(this)
                .children("a")
                .children("p.teaser")
                .text();

                // console.log(result.title, result.link, result.summary)
                
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.redirect("/");
        });
    });

    // route for deleting all Articles from the db
    app.get("/clear", function (req, res) {
        db.Article.deleteMany({ saved: false })
            .then(function (dbArticle) {
                res.redirect("/");
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post("/updatedarticles/:id", function (req, res) {
        console.log(req.params.id)
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
            .then(function (dbArticle) {
                console.log(dbArticle)
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });


    });

    app.post("/savedarticles/:id", function (req, res) {

        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
            .then(function (dbArticle) {
                // console.log(dbArticle)
                res.json(dbArticle)
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {

        db.Note.create(req.body)
            .then(function (dbNote) {

                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // 404 page
    app.get("*", function (req, res) {
        res.render("404");
    });

};

