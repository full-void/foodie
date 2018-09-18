const express = require("express"),
    router = express.Router({mergeParams: true}),
    location = require("../models/location"),
    Comment = require("../models/comment"),
    middleware = require("../helpers/authenticators"),
    {logger} = require("../helpers/loggers");

router.post("/", middleware.isLoggedIn, (req, res) => {
    logger.info(`The user @${req.user   .username} is trying to posting a comment.`);
    location.findById(req.params.id, (err, location) => {
        if (err) {
            console.log(err);
            res.redirect("/locations");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    logger.warn(`The user @${req.user.username}'s posting of comment ${req.body.comment.text.substr(1,20)} is unsuccessful.`);
                    req.flash("error", "Something went wrong. Please try again after sometime.");
                    console.log(err);
                } else {
                    // Additional Details
                    comment.author = req.user._id;
                    comment.save();
                    location.comments.push(comment);
                    location.save();
                    // Success
                    logger.info(`The user @${req.user.username}'s posting of comment ${req.body.comment.text.substr(1,20)} is successful.`);
                    req.flash("success", "Thanks for the comment!");
                    res.redirect("/locations/" + location._id);
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.isCommentAuthorized, (req, res) => {
    logger.info(`The user @${req.user.username} is trying to changing a comment.`);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            logger.warn(`The user @${req.user.username}'s changing of comment ${req.params.comment_id} is unsuccessful.`);
            req.flash("error", "Something went wrong. Please try again after sometime.");
            res.redirect("back");
        }
        else {
            logger.info(`The user @${req.user.username}'s changing of comment ${req.params.comment_id} is successful.`);
            req.flash("success", "Successfully updated your comment!");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.isCommentAuthorized, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, err => {
        if (err) {
            logger.warn(`The user @${req.user.username}'s deletion of comment with id ${req.params.comment_id} is unsuccessful.`);
            req.flash("error", "Can't remove comment now. Please try again after sometime.")
            res.redirect("back");
        }
        else {
            logger.info(`The user @${req.user.username}'s deletion of comment with id ${req.params.comment_id} is successful.`);
            req.flash("success", "Comment successfully deleted");
            res.redirect("/locations/" + req.params.id);
        }
    });
});

module.exports = router;
