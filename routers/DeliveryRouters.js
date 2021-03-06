const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");

// Models
require("../models/ProductionModel.Js");
require("../models/ClientModel");
const ProductionModel = mongoose.model("production");
const ClientModel = mongoose.model("client");

// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

// Delivery Home
Router.get("/", (req, res) => {
  ProductionModel.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { "Status.Status": "F"},
              { "Status.Status": "E" },
            ],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "Client",
        foreignField: "_id",
        as: "Client",
      },
    },
  ]).then((Production) => {
    res.render("Admin/Delivery/Index", {
      title: "LL-System",
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
        },
      Production: Production,
      Menu: 'Delivery'
    });
  });
});

module.exports = Router;
