const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/ClientModel");
const ClientModel = mongoose.model("client");
// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

// Client Home
Router.route("/").get( (req, res) => {
  ClientModel.find().then((Client) => {
    res.render("Admin/Client/Index", {
      title: "LL-System",
      style: {
        style1: "plugins/bootstrap/dist/css/bootstrap.min.css",
        style2: "plugins/ionicons/dist/css/ionicons.min.css",
        style3: "plugins/icon-kit/dist/css/iconkit.min.css",
        style4: "plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
        style6: "css/theme.css",
        style7: "plugins/fontawesome-free/css/all.min.css",
        style8: "css/sweetalert2.min.css",
        
      },
      js: {
        js1: "js/jquery/jquery-3.3.1.min.js",
        js2: "plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js",
        js3: "plugins/popper.js/dist/umd/popper.min.js",
        js4: "plugins/bootstrap/dist/js/bootstrap.min.js",
        js5: "plugins/datatables.net/js/jquery.dataTables.min.js",
        js6: "js/theme.min.js",
        js7: "js/Pages/Client.js",
        js9: "js/Pages/xhttp.js",
        js10: "js/sweetalert2/sweetalert2.all.min.js",
        // js9: "js/JsTheme/datatables.js",
      },
      Client: Client,
      Menu: 'Client'
    });
  });
});

module.exports = Router;
