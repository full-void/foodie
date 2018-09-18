const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    {logger} = require("../helpers/loggers");

router.get('/', (req, res) => res.render('landing'));

router.get("/signup", (req, res) => res.render("signup", {page: "signup"}));

router.post("/signup", (req, res) => {
    logger.info('Attempt to create new user');
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });

    if (req.body.adminCode === process.env.ADMINCODE) {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate email
                req.flash("error", "That email has already been registered. Please try a different email.");
                return res.redirect("/signup");
            }
            logger.warn('An unsuccessful attempt at creating a new user.');
            // Some other error
            req.flash("error", "Something went wrong... Please try again.");
            return res.redirect("/signup");
        }

        passport.authenticate("local")(req, res, () => {
            logger.info(`A user with id ${user._id} is created.`);
            req.flash("success", "Glad to have you on board, " + user.username + "!");
            res.redirect("/locations");
        });
    });
});

router.get("/login", (req, res) => res.render("login", {page: "login"}));

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            req.flash("error", "Something went wrong... Please try again later.");
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password. Please check again.");
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/locations';
            delete req.session.redirectTo;
            req.flash("success", "Glad to see you back, " + user.username + "!");
            res.redirect(redirectTo);
        });
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out successfully. Look forward to seeing you again!");
    res.redirect("/locations");
});

module.exports = router;