const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/UserModel");
const UserModel = mongoose.model("user");

// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

Router.get("/", (req, res) => {
  UserModel.find()
    .then((User) => {
      res.render("Admin/User/Index", {
        title: "Premol-Lirios",
        style: {
          style1: "plugins/bootstrap/dist/css/bootstrap.min.css",
          style2: "plugins/ionicons/dist/css/ionicons.min.css",
          style3: "plugins/icon-kit/dist/css/iconkit.min.css",
          style4:
            "plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
          style6: "css/theme.css",
          style7: "css/sweetalert2.min.css",
          style8: "plugins/fontawesome-free/css/all.min.css",
        },
        js: {
          js1: "js/jquery/jquery-3.3.1.min.js",
          js2: "plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js",
          js3: "plugins/popper.js/dist/umd/popper.min.js",
          js4: "plugins/bootstrap/dist/js/bootstrap.min.js",
          js5: "plugins/datatables.net/js/jquery.dataTables.min.js",
          js6: "js/sweetalert2/sweetalert2.all.min.js",
          js7: "js/theme.min.js",
          js8: "js/pages/xhttp.js",
          js9: "js/pages/User.js",
          // js10: "plugins/select2/dist/js/select2.min.js",
        },
        User: User,
        Menu: 'User'
      });
    })
    .catch((err) => {
      req.flash("MsgError", "Error loading data");
      res.redirect("User");
    });
});

module.exports = Router;
