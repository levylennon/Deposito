"use strict";
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// User Model
require("../models/UserModel");
const UserModel = mongoose.model("user");

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      { usernameField: "Username", passwordField: "Password" },
      (Username, Password, done) => {
        UserModel.findOne({ Username: Username })
          .then((Data) => {
            if (!Data) {
              return done(null, false, { message: "Incorrect username." });
            }

            bcrypt.compare(Password, Data.Password, (err, match) => {
              if (match) {
                return done(null, Data);
              } else {
                return done(null, false, { message: "Incorrect password." });
              }
            });
          })
      }
    )
  );
  // Save user's session
  passport.serializeUser( (Data, done)  => {
    done(null, Data._id);
  });

  passport.deserializeUser( (_id, done) => {
    UserModel.findById(_id, (err, Data) => {
      done(err, Data);
    });
  });
};
