const express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    location = require("../models/location"),
    middleware = require("../helpers/authenticators"),
    {logger} = require("../helpers/loggers");

router.get("/:id", middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user) {
            req.flash("error", "Something went wrong... Please try again.");
            res.redirect("/locations");
        } else {
            location.find().where("author").equals(user._id).exec((err, locations) => {
                if (err) {
                    req.flash("error", "Something went wrong...");
                    res.redirect("/locations");
                } else {
                    res.render("users/show", {user: user, locations});
                }
            });
        }
    });
});

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user) {
            return res.redirect("back");
        }
        if (user._id.equals(req.user._id)) {
            res.render("users/edit", {user: user});
        } else {
            req.flash("error", "Not sufficient permissions. Please login and try again.");
            res.redirect("back");
        }
    });
});

router.put("/:id", middleware.isLoggedIn, (req, res) => {
    logger.info(`An attempt to update the user with id ${req.params.id} is made.`);
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate email
                req.flash("error", "That email has already been registered.");
                return res.redirect("/users" + req.params.id);
            }
            // Some other error
            logger.warn(`The attempt to modify the user with id ${req.params.id} has failed.`);
            req.flash("error", "Something went wrong... Please try again later");
            return res.redirect("/users" + req.params.id);
        }
        if (updatedUser._id.equals(req.user._id)) {
            req.flash("Change successful. Please login again.");
            res.redirect("/");
        } else {
            req.flash("error", "Not sufficient permissions. Please login and try again.");
            res.redirect("/locations");
        }
    });
});

module.exports = router;