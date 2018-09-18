const express = require("express"),
    router = express.Router(),
    Location = require("../models/location"),
    authenticators = require("../helpers/authenticators"), // automatically looks for authenticators.js
    geocoder = require("google-geocoder"),
    locus = require("locus"),
    {logger} = require("../helpers/loggers");

geo = geocoder({
    key: process.env.GOOGLE_API_KEY,
});

const safeRegex = text => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

router.get("/", (req, res) => {
    let noMatch = null;
    // Check for filter
    if (req.query.search) {
        const regex = new RegExp(safeRegex(req.query.search), 'gi');
        Location.find({name: regex}, function (err, filteredLocations) {
            if (err) {
                console.log(err);
            }
            else {
                if (filteredLocations.length < 1) {
                    noMatch = "No locations found, please try again.";
                }
                res.render("locations/index", {locations: filteredLocations, page: "locations", noMatch: noMatch});
            }
        });
    } else {
        Location.find({}, function (err, locations) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("locations/index", {locations: locations, page: "locations", noMatch: noMatch});
            }
        });
    }
});

router.post("/", authenticators.isLoggedIn, (req, res) => {
    logger.info(`The user @${req.user.username} is trying to create new location.`);

    let newLocation = {
        name: req.body.name,
        image: req.body.image,
        cost: req.body.cost,
        description: req.body.description,
        author: req.user._id,
    };

    // Google Maps
    geo.find(req.body.location, (err, data) => {
        if (err) {
            req.flash("error", "There is something wrong with the location. Please check and try again.");
            res.redirect("back");
            return;
        }

        // Prettify the stuff
        newLocation.lat = data[0].location.lat;
        newLocation.lng = data[0].location.lng;
        newLocation.location = data[0].formatted_address;
        // Save to DB
        Location.create(newLocation, (err, newlyCreated) => {
            if (err) {
                req.flash("error", "Something went wrong. Please try again later.");
                console.log(err);
            }
            else {
                logger.info(`New location with id ${newlyCreated._id} is created`);
                res.redirect("/locations");
            }
        });
    });

});

router.get("/new", authenticators.isLoggedIn, (req, res) => res.render("locations/new"));

router.get("/:id", (req, res) => {
    Location.findById(req.params.id).populate("author").populate({
        path: "comments",
        populate: {
            path: "author"
        }
    }).exec((err, location) => {
        if (err || !location) {
            console.log(err);
            req.flash("error", "We couldn't find the location. Please try again.");
            res.redirect("back");
        } else {
            console.log(location._id.toString());
            res.render("locations/show", {location: location});
        }
    });
});

router.get("/:id/edit", authenticators.isLocationAuthorized, (req, res) => {
    Location.findById(req.params.id, (err, location) => {
        if (err) {
            req.flash("Soemthing is wrong. Please try again later.");
            res.redirect("/locations")
        }
        else {
            res.render("locations/edit", {location: location});
        }
    });
});

// update location route
router.put("/:id", authenticators.isLocationAuthorized, (req, res) => {
    logger.info(`The user @${req.user.username} is trying to update the location with id ${req.params.id}`);
    // Google Maps
    let newLocation = {
        name: req.body.name,
        image: req.body.image,
        cost: req.body.cost,
        description: req.body.description,
        author: req.user._id,
    };
    // newLocation.lat = 37.4222312;
    // newLocation.lng = -122.0857822;
    // newLocation.location = "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
    geo.find(req.body.location, (err, data) => {
        if (err) {
            req.flash("error", "There is something wrong with the location. Please check and try again.");
            res.redirect("back");
        }

        // Prettify the stuff
        newLocation.lat = data[0].location.lat;
        newLocation.lng = data[0].location.lng;
        newLocation.location = data[0].formatted_address;

        // Change in DB
        Location.findByIdAndUpdate(req.params.id, newLocation, (err, newlyCreated) => {
            if (err) {
                logger.warn(`The user @${req.user.username} attempt to update the location with id ${req.params.id} failed.`);
                console.log(err);
                req.flash("Something is wrong... Please try again later.");
                res.redirect("/locations");
            }
            else {
                logger.info(`The user @${req.user.username} has successfully updated the location with id ${req.params.id}`);
                req.flash("Successfully updated your foodie location!");
                res.redirect("/locations/" + req.params.id);
            }
        })
    });
});

router.delete("/:id", authenticators.isLocationAuthorized, (req, res) => {
    logger.info(`The user @${req.user.username} is trying to delete the location with id ${req.params.id}`);
    Location.findByIdAndRemove(req.params.id, err => {
        if (err) {
            logger.warn(`The user @${req.user.username} attempt to delete the location with id ${req.params.id} failed.`);
            res.redirect("/locations");
        }
        else {
            logger.info(`The user @${req.user.username} has successfully deleted the location with id ${req.params.id}`);
            req.flash("success", "location removed!");
            res.redirect("/locations");
        }
    });
});

module.exports = router;
