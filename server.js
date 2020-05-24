"use strict";

const express     = require("express");
const fccTesting  = require("./freeCodeCamp/fcctesting.js");
const session     = require('express-session');
const passport    = require('passport');
const mongo       = require('mongodb').MongoClient;
const ObjectID    = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

mongo.connect(process.env.DATABASE,{ useUnifiedTopology: true }, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');

        passport.serializeUser((user, done) => {
          done(null, user._id);
        });

        passport.deserializeUser( (id, done) => {
            db('test').collection('users').findOne(
                {_id: new ObjectID(id)},
                (err, doc) => {
                    done(null, doc);
                }
            );
        });

        app.route('/')
          .get((req, res) => {
            res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'});
          });

        app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);
        });  
}});
