"use strict";
const routes      = require('./routes.js');
const auth        = require('./auth.js');

const express     = require("express");
const session     = require('express-session');
const passport    = require('passport');
const mongo       = require('mongodb').MongoClient;


const LocalStrategy = require('passport-local');

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug')


mongo.connect(process.env.DATABASE,{ useUnifiedTopology: true }, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');
      
        auth(app, db);
      
        routes(app, db);


        app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);
        });  
}});
