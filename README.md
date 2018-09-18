# FOODIE

A RESTful full stack web application with focus on creating a restaurant sharing and reviewing website.

## Live Demo

Here's the live demo of the app on [heroku](https://foodie-demo.herokuapp.com/)

## Routes Documentation

The routes have been documented on Postman. They are present [here](https://documenter.getpostman.com/view/5273181/RWaLwTvC)

## Core Mechanics

1. **Responsive** web application with *Bootstrap*
2. **Templates** with *ejs*
3. **Back-end** based on *Node.js*
4. Uses the *Express* **framework**
5. *Passport.js* for **authentication** and **authorization**
6. *MongoDB* as the **database**
7. *Winston* for **logging**
8. *Nodemailer* for **emails** [Disabled]
9. *Google Maps* for location information

## Features

1. Beautiful design

  1. Fully responsive website

  2. Uses material colors

  3. Flash messages for enhanced user experience

  4. "Pinterest" style masonry layout for posts

2. Basic posts about your favorite food location

  1. Create, read, edit and delete (CRUD) comments and post

  2. Cover photo of the location

  3. Show the location via Google Maps

  4. Fuzzy search on locations


3. Authentication and authorization
  
  1. Login with username and password

  2. Only comments and post made by the user allowed to be updated or deleted

  3. Admin sign-up with admin code

  4. Full rights to the admin on editing or deleting posts of other users

4. User account

  1. Profile page showing important info and posts made for easy access

  2. Only authorized people can access the profile

  3. Ability to update complete profile. Everything (including username) will be automatically changed in posts and comments

  4. ~~Email token-based password reset~~ [Disabled]


## Installation

**NOTE:** This app uses sensitive data like API keys and passwords. They are to be set inside the `.env` file (intentionally excluded) before running the app. Make sure you do that before the rest of steps.

Clone

`git clone https://github.com/lucasweng/yelp-camp.git`

Configure dependencies

`npm install`

or

`yarn install`

Start the server

`npm start`

or

`yarn start`

**NOTE:** Make sure mongod is running.

## Dependencies

    "async": "^2.6.0",
    "bluebird": "^3.5.2",
    "body-parser": "^1.18.2",
    "cookie-session": "^2.0.0-beta.3",
    "connect-flash": "^0.1.1",
    "dotenv": "^6.0.0",
    "ejs": "^2.5.7",
    "express": "^4.16.2",
    "google-geocoder": "^0.2.1",
    "helmet": "^3.9.0",
    "locus": "^2.0.1",
    "masonry-layout": "^4.2.2",
    "method-override": "^2.3.10",
    "moment": "^2.19.2",
    "mongoose": "^4.13.0",
    "multer": "^1.3.0",
    "nodemailer": "^4.4.0",
    "passport": "^0.4.0",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^4.4.0",
    "winston": "^3.1.0"
