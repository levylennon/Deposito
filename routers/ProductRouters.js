const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/ProductModel");
const ProductModel = mongoose.model("product");
require("../models/MeasuresModel");
const MeasureModel = mongoose.model("measures");
// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

// Product
Router.get("/", (req, res) => {
  let Measure;
  
  MeasureModel.find().sort({Description: 'desc'})
  .then((Data) => {
    Measure = Data;
  })
  ProductModel.find().sort({Description: 'desc'})
    .then((Product) => {
      res.render("Admin/Product/Index", {
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
          js8: "js/pages/xhttp.js",
          js9: "js/pages/Product.js",
        },
        Product: Product,
        Measure: Measure,
        Menu: 'Product'
      });
    })
});

// View New Product
Router.get("/New", (req, res) => {
  MeasureModel.find({}, { Description: 1 })
    .then((Data) => {
      res.render("Admin/Product/NewProduct", {
        title: "New Product",
        style: {
          style1: "css/bootstrap.min.css",
          style2: "css/custom/custom.css",
        },
        js: {
          js1: "js/jquery/jquery-3.5.1.slim.min.js",
          js2: "js/bootstrap/popper.min.js",
          js3: "js/bootstrap/bootstrap.min.js",
        },
        Data: Data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/Product");
    });
});
// Insert

// view Edit Product
Router.post("/ProductEdit", (req, res) => {
  MeasureModel.find()
    .then((MeasureData) => {
      ProductModel.findOne({ _id: req.body._id }).then((Product) => {
        res.render("Admin/Product/EditProduct", {
          title: "App",
          style: {
            style1: "css/bootstrap.min.css",
            style2: "css/custom/custom.css",
          },
          js: {
            js1: "js/jquery-3.5.1.slim.min.js",
            js2: "js/popper.min.js",
            js3: "js/bootstrap.min.js",
            js4: "js/Pages/Product.js",
          },
          Product: Product,
          MeasureData: MeasureData,
        });
      });
    })
    .catch((err) => {
      req.flash("MsgError", "This product does not exist");
      res.redirect("/Product");
    });
});


module.exports = Router;
