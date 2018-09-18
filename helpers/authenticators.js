const location = require("../models/location"),
    Comment = require("../models/comment"),
    {logger} = require("./loggers");

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You need to be logged in first"); // add a one-time message before redirect
    res.redirect("/login");
};

middlewareObj.isLocationAuthorized = function (req, res, next) {
    if (req.isAuthenticated()) {
        location.findById(req.params.id, (err, foundlocation) => {
            if (err || !foundlocation) {
                req.flash("error", "Location not found. Please try again.");
                res.redirect("back");
            } else {
                // does the user own the location
                if (foundlocation.author.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash("error", "Insufficient permissions. Please login as the owner or administrator.");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in first,");
        res.redirect("/login");
    }
};

middlewareObj.isCommentAuthorized = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Comment not found. Please try again.");
                res.redirect("back");

            } else {
                // does the user own the comment
                if (foundComment.author.equals(req.user._id) || req.user.isAdmin) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in first");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;