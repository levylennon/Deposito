const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/ProductModel");
const ProductModel = mongoose.model("product");

require("../models/ClientModel");
const ClientModel = mongoose.model("client");

require("../models/ProductionModel.Js");
const ProductionModel = mongoose.model("production");

// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

// Home
Router.get("/", (req, res) => {
  res.render("index", {
    title: "LL-System",
    style: {
      style1: "plugins/bootstrap/dist/css/bootstrap.min.css",
      style2: "plugins/icon-kit/dist/css/iconkit.min.css",
      style3: "plugins/perfect-scrollbar/css/perfect-scrollbar.css",
      style4: "css/theme.css",
      style5: "plugins/fontawesome-free/css/all.min.css",
    },
    js: {
      js1: "js/jquery/jquery-3.3.1.min.js",
      js2: "plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js",
      js3: "plugins/popper.js/dist/umd/popper.min.js",
      js4: "plugins/bootstrap/dist/js/bootstrap.min.js",
      js5: "js/theme.min.js",
      js6: "js/Pages/xhttp.js",
      js7: "js/Pages/Home.js",
    },
    Menu: "Home",
  });
});

Router.route("/Login")
  .get((req, res) => {
    res.render("login/index", {
      title: "LL-System",
      style: {
        style1: "plugins/bootstrap/dist/css/bootstrap.min.css",
        style2: "plugins/ionicons/dist/css/ionicons.min.css",
        style3: "plugins/icon-kit/dist/css/iconkit.min.css",
        style4: "css/theme.css",
      },
      js: {
        js1: "js/jquery/jquery-3.5.1.slim.min.js",
        js2: "js/bootstrap/popper.min.js",
        js3: "js/bootstrap/bootstrap.min.js",
      },
    });
  })
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/Login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        if (user.Level == 2) {
          return res.redirect("/");
        } else if (user.Level == 0) {
          // employeer
          return res.redirect("/Funcionario");
        } else if (user.Level == 1) {
          return res.redirect("/Motorista"); // driver
        }
      });
    })(req, res, next);
  });

Router.get("/Logout", (req, res) => {
  req.logout();
  res.redirect("/Login");
});

module.exports = Router;
