const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");

// Models
require("../models/ProductionModel.Js");
require("../models/ProductModel");
const ProductionModel = mongoose.model("production");
const ProductModel = mongoose.model("product");

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
            $or: [{ "Status.Status": "F" }, { "Status.Status": "E" }],
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
    res.render("Driver/Delivery/Index", {
      title: "Premol-Lirios",
      style: {
        style1: "plugins/bootstrap/dist/css/bootstrap.min.css",
        style2: "plugins/ionicons/dist/css/ionicons.min.css",
        style3: "plugins/icon-kit/dist/css/iconkit.min.css",
        style4: "plugins/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
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
      Menu: "Delivery",
    });
  });
});

Router.post("/view", (req, res) => {
  ProductionModel.aggregate([
    {
      $lookup: {
        from: "clients",
        localField: "Client",
        foreignField: "_id",
        as: "Client",
      },
    },
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.body.id),
      },
    },
    {
      $group: {
        _id: {
          _id: "$_id",
          CreatedAt: "$CreatedAt",
          UpdatedAt: "$UpdatedAt",
          AdressDelivery: "$AdressDelivery",
          Client: "$Client",
          Priority: "$Priority",
          StartDate: "$StartDate",
          DeliveryDate: "$DeliveryDate",
          Product: "$Product",
          Status: "$Status",
          Product: "$Product",
        },
        SumPrice: {
          $sum: {
            $sum: "$Product.Price",
          },
        },
        SumQuantity: {
          $sum: {
            $sum: "$Product.ProductQuantity",
          },
        },
      },
    },
  ])
    .then((Data) => {
      res.render("Driver/Delivery/view", {
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
          js9: "js/pages/Driver/View.js",
        },
        Data: Data,
        Menu: "Production",
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.post("/Entregar", (req, res) => {
  ProductionModel.find({ _id: req.body._id }, {}).then((Data) => {
    for (let i = 0; i < Data[0].Product.length; i++) {
      ProductModel.findOne({ _id: Data[0].Product[i].IdProduct }).then(
        (StockProduct) => {
          if (Data[0].Product[i].Type == "N") {
            StockProduct.Stock.push({
              Quantity: -Data[0].Product[i].ProductQuantity,
              Operation: "D",
              Motive: "Entrega Produção",
              User: req.body.User,
            });
            StockProduct.save();
          }
        }
      );
    }

    Data[0].Status.Status = "E";
    Data[0].save();
  }).then(() => {
    res.send("success");
  });
});

module.exports = Router;