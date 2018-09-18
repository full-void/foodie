require('dotenv').config();

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    helmet = require("helmet"),
    flash = require("connect-flash"),
    session = require("cookie-session"),
    moment = require("moment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user"),
    {logger} = require("./helpers/loggers");

// Import Routes
const indexRoute = require("./routes/index"),
    locationRoute = require("./routes/locations"),
    commentRoute = require("./routes/comments"),
    userRoute = require("./routes/user"),
    passwordRoute = require("./routes/password");

// Initial Setup
let url = process.env.DATABASE_URL;
mongoose.Promise = require('bluebird');
mongoose.connect(url, {useMongoClient: true});

app.set("view engine", "ejs");
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment; // create local variable available for the application

// Passport config
app.use(session({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24*60*3600
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Things available for entire session
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // req.user is an authenticated user
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Use Routes
app.use("/", indexRoute);
app.use("/locations", locationRoute);
app.use("/locations/:id/comments", commentRoute);
app.use("/users", userRoute);
app.use("/", passwordRoute);

app.listen(process.env.PORT, process.env.IP, () => logger.info(`Server has started at port ${process.env.IP}:${process.env.PORT}`));
