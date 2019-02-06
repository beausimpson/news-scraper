
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

    // home page
    app.get("/", function (req, res) {
        res.render("index");
    });

    // saved article page
    app.get("/saved", function (req, res) {
        res.render("saved")
    });

    app.get("/scrape", function (req, res) {
        axios.get("http://www.echojs.com/").then(function (response) {

            var $ = cheerio.load(response.data);

            $("article h2").each(function (i, element) {
                var result = {};

                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("a")
                    .attr("href");

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

    // 404 page
    app.get("*", function (req, res) {
        res.render("404");
    });

};