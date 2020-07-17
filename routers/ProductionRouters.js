const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/ProductModel");
require("../models/ProductionModel.Js");
require("../models/ClientModel");

const ProductModel = mongoose.model("product");
const ProductionModel = mongoose.model("production");
const ClientModel = mongoose.model("client");
// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");

Router.get("/", (req, res) => {
  ClientModel.find({}, { _id: 1, Name: 1 }).then((Data) => {
    res.render("Admin/production/Index", {
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
        js8: "js/pages/xhttp.js",
        js9: "js/pages/Production.js",
        js10: "plugins/moment/moment.js",
      },
      Client: Data,
      Menu: "Production",
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
    }    
  ])
    .then((Data) => {
      res.render("Admin/production/view", {
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
          js9: "js/pages/ProductionView.js",
        },
        Data: Data,
        Menu: "Production",
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.post("/Produdir", (req, res) => {
  ProductionModel.findOneAndUpdate(
    { _id: req.body._id },
    { Status: { Status: "P" }, UpdatedAt: Date.Now },
    {
      returnNewDocument: true,
    },
    (err, results) => {
      // In this moment, you recive a result object or error
      if (err) {
        console.log(err);
      }
      if (results) {
        res.redirect("/Production");
      }
      // ... Your code when have result ... //
    }
  );
});

Router.post("/Finalizar", (req, res) => {
  let ArrayProducts = [];

  ProductionModel.find({ _id: req.body._id }, {}).then((Data) => {
    ArrayProducts = Data[0].Product;


    for (let i = 0; i < ArrayProducts.length; i++) {
      let QuantidadeProduto = ArrayProducts[i].ProductQuantity;
      let IdProduct = ArrayProducts[i].IdProduct;

      // function, verifico se o produto é normal pra dar entrada no estoque
      if (ArrayProducts[i].Type == "N") {
        ProductModel.findOne({ _id: IdProduct }).then((DataProduct) => {
          DataProduct.Stock.push({
            IdProduction: req.body._id,
            Operation: "P",
            Quantity: QuantidadeProduto,
          });
          // console.log(DataProduct)
          DataProduct.save();

          // verifico se tem receita, se tiver, faço o calculo de multiplicação pra extreair a quantidade correta de materia-prima

          if (DataProduct.Recipe.length > 0) {
            ProductModel.findOne({ _id: IdProduct }).then((Data) => {
              let Loop = Data.Recipe;
              // Consigo trazer o Produto que tem receita e a receita também
              for (let i = 0; i < Loop.length; i++) {
                // Nesse for eu tenho a quantidade total de entrada ou saida da materia prima, faço o update na function abaixo
                ProductModel.findOne({ _id: Loop[i].IdSeedstock }).then(
                  (OutStock) => {
                    OutStock.Stock.push({
                      IdProduction: req.body._id,
                      Operation: "SP",
                      Quantity: -(Loop[i].Quantity * QuantidadeProduto),
                    });
                    OutStock.save();
                  }
                );
              }
            });
          }
        });
      }

      // dou a entrada no produto fabricado
    }

    Data[0].Status.Status = "F";
    Data[0].save();

    res.redirect("/Production");
  });
});

Router.post("/Entregar", (req, res) => {
  ProductionModel.find({ _id: req.body._id }, {})
    .then((Data) => {
      Data[0].Status.Status = "E";
      Data[0].save();
    })
    .then(() => {
      res.redirect("/Delivery");
    });
});

module.exports = Router;
