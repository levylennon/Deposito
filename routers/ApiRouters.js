const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
// Models
require("../models/ProductModel");
require("../models/UserModel");
require("../models/MeasuresModel");
require("../models/ProductionModel.Js");
require("../models/ClientModel");
require("../models/EstadosModel");
require("../models/SupplierModel");
require("../models/TransactionNatureModel");

// Request pages out server
const axios = require("axios");

const MeasuresModel = mongoose.model("measures");
const ProductModel = mongoose.model("product");
const UserModel = mongoose.model("user");
const ProductionModel = mongoose.model("production");
const ClientModel = mongoose.model("client");
const EstadosModel = mongoose.model("estados");
const SupplierModel = mongoose.model("supplier");
const TransactionNature = mongoose.model("transactionNature");

// Crypt
const bcrypt = require("bcryptjs");
// Auth
const passport = require("passport");
// Levels Permission
const { isAdmin } = require("../helpers/LevelAdmin");
const { Authentication } = require("../helpers/Authentication.js");
const { response } = require("express");

require('dotenv').config();


// -------------------------------- Clients
Router.post("/AddClient", (req, res) => {
  const newClient = {
    Name: req.body.Name,
    CPF: req.body.CPF,
    Nickname: req.body.Nickname,
    Address: req.body.Address,
  };
  new ClientModel(newClient)
    .save()
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.get("/Client/:_Id", (req, res) => {
  ClientModel.find({ _id: req.params._Id }).then((Client) => {
    res.json(Client);
  });
});

Router.get("/AllClient", (req, res) => {
  ClientModel.find().then((Client) => {
    res.json(Client);
  });
});

Router.post("/EditClient", (req, res) => {
  ClientModel.findOne({ _id: req.body._id })
    .then((ClientUpdate) => {
      ClientUpdate.Name = req.body.NameUpdade;
      ClientUpdate.CPF = req.body.CPFUpdate;
      ClientUpdate.Nickname = req.body.ApelidoUpdate;
      ClientUpdate.Address = req.body.AddressUpdate;

      ClientUpdate.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send("not found");
    });
});

Router.get("/DeletClient/:id", (req, res) => {
  ClientModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

// -----------------------------------------
//  -------------------------  Products

Router.get("/AllProduct", (req, res) => {
  ProductModel.aggregate([
    {
      $lookup: {
        from: "measures",
        localField: "Measure",
        foreignField: "_id",
        as: "Measure",
      },
    },
  ]).then((Product) => {
    res.json(Product);
  });
});

Router.get("/Product/:id", (req, res) => {
  ProductModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: "measures",
        localField: "Measure",
        foreignField: "_id",
        as: "Measure",
      },
    },
  ]).then((Product) => {
    res.json(Product);
  });
});

Router.get("/DeletProduct/:id", (req, res) => {
  ProductModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.post("/AddProduct", (req, res) => {
  const newProduct = {
    Description: req.body.Description,
    Barcode: req.body.Barcode,
    Value: req.body.Value,
    Measure: req.body.Measure,
    Type: req.body.Type,
    Stock: [
      {
        Operation: "C",
        Quantity: 0,
        Motive: "Cadastro",
        User: req.body.User,
      },
    ],
  };

  new ProductModel(newProduct)
    .save()
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      console.log(err);
    });
});

Router.post("/EditProduct", (req, res) => {
  ProductModel.findOne({ _id: req.body._id })
    .then((ProductUpdate) => {
      ProductUpdate.Description = req.body.Description;
      ProductUpdate.Barcode = req.body.Barcode;
      ProductUpdate.Measure = req.body.Measure;
      ProductUpdate.Type = req.body.Type;
      ProductUpdate.Value = req.body.Value;
      ProductUpdate.UpdatedAt = Date.now();

      ProductUpdate.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send("not found");
    });
});

Router.get("/ProductGetPrice/:id", (req, res) => {
  ProductModel.findOne({ _id: req.params.id }, { Value: 1 }).then((Price) => {
    res.json(Price);
  });
});

// -----------------------------------------
// -------------------------------- Measure

Router.get("/Measures/:id", (req, res) => {
  MeasuresModel.find(
    { _id: req.params.id },
    { _id: 1, Description: 1, Abbreviation: 1 }
  ).then((Measures) => {
    res.json(Measures);
  });
});

Router.get("/Measures", (req, res) => {
  MeasuresModel.find().then((Measures) => {
    res.json(Measures);
  });
});

Router.post("/AddMeasure", (req, res) => {
  const Measures = {
    Description: req.body.Description,
    Abbreviation: req.body.Abbreviation,
  };
  new MeasuresModel(Measures)
    .save()
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.post("/EditMeasure", (req, res) => {
  MeasuresModel.findOne({ _id: req.body._id })
    .then((MeasureUpdate) => {
      MeasureUpdate.Description = req.body.Description;
      MeasureUpdate.Abbreviation = req.body.Abbreviation;
      MeasureUpdate.UpdatedAt = Date.now();

      MeasureUpdate.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send("not found");
    });
});

Router.get("/DeletMeasure/:id", (req, res) => {
  MeasuresModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

// -----------------------------------------
// -------------------------------- Stock

Router.get("/HistoryProduct/:id", (req, res) => {
  ProductModel.find({ _id: req.params.id }, { _id: 0, Stock: 1 }).then(
    (Product) => {
      res.json(Product);
    }
  );
});

Router.post("/UpdateStock", (req, res) => {
  let Data = [];

  if (req.body.Operation == "O") {
    Data = {
      Operation: req.body.Operation,
      Quantity: -req.body.Quantity,
      Motive: req.body.motive,
      User: req.body.user,
      CreatedAt: Date.now(),
    };
  } else if (req.body.Operation == "E") {
    Data = {
      Operation: req.body.Operation,
      Quantity: req.body.Quantity,
      Motive: req.body.motive,
      User: req.body.user,
      CreatedAt: Date.now(),
    };
  }

  ProductModel.findOne({ _id: req.body.Product })
    .then((StockUpdate) => {
      StockUpdate.Stock.push(Data);

      StockUpdate.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    })
    .catch((err) => {
      res.send("not found");
    });
});

Router.get("/StockAll", (req, res) => {
  ProductModel.aggregate([
    {
      $group: {
        _id: {
          _id: "$_id",
          Description: "$Description",
          CurrentQuantity: {
            $sum: {
              $sum: "$Stock.Quantity",
            },
          },
        },
      },
    },
  ])
    .sort({ Description: "desc" })
    .then((Product) => {
      res.json(Product);
    });
});

// -----------------------------------------
// ------------------------------------- User

Router.post("/AddUser", (req, res) => {
  UserModel.findOne({ Username: req.body.Username }).then((Data) => {
    if (Data) {
      res.send("Userregistered");
      return;
    }

    const newUser = {
      Name: req.body.Name,
      Username: req.body.Username,
      Password: req.body.Password,
      Level: req.body.Level,
    };

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.Password, salt, (err, hash) => {
        if (err) {
          res.send("ErrorOccurred");
          return;
        }

        newUser.Password = hash;

        new UserModel(newUser)
          .save()
          .then(() => {
            res.send("success");
          })
          .catch((err) => {
            res.send(err);
          });
      });
    });
  });
});

Router.post("/EditUser", (req, res) => {
  UserModel.findOne({ _id: req.body._id })
    .then((UserUpdate) => {
      UserUpdate.Name = req.body.NameUpdate;
      UserUpdate.Username = req.body.UsernameUpdate;
      UserUpdate.Level = req.body.LevelUpdate;
      UserUpdate.UpdatedAt = Date.now();

      UserUpdate.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send("not found");
    });
});

Router.get("/User/:id", (req, res) => {
  let Data = [];
  UserModel.findOne(
    { _id: req.params.id },
    { Name: 1, Username: 1, Level: 1 }
  ).then((Product) => {
    Data.push(Product);
    res.json(Data);
  });
});

Router.get("/User", (req, res) => {
  UserModel.find({}, { Name: 1, Username: 1, Level: 1 }).then((User) => {
    res.json(User);
  });
});

Router.get("/DeleteUser/:id", (req, res) => {
  UserModel.deleteOne({ _id: req.params.id })
    .then(() => {
      res.send("success");
    })
    .catch((err) => {
      res.send(err);
    });
});

// -----------------------------------------
// ---------------------------- Production
Router.post("/AddProduction", (req, res) => {
  let Product = [];
  let LoopProduct;

  req.body.Product.forEach((Data) => {
    LoopProduct = {
      DescriptionProduct: Data.DescriptionProduct,
      IdProduct: Data.IdProduct,
      Image: Data.Image,
      ProductQuantity: Data.ProductQuantity,
      Type: Data.Type,
      Price: Data.Price,
    };

    Product.push(LoopProduct);
  });

  const newProduction = {
    AdressDelivery: req.body.AdressDelivery,
    Client: req.body.Client,
    Priority: req.body.Priority,
    StartDate: req.body.StartDate,
    DeliveryDate: req.body.DeliveryDate,
    Product: Product,
    User: req.body.User,
    Status: {
      Status: "A",
    },
  };

  new ProductionModel(newProduction)
    .save()
    .then(() => {
      res.send("saved");
    })
    .catch((err) => {
      res.send(err);
    });
});

// ----- Update Status and Delivery
Router.get("/Production/:status", (req, res) => {
  let JsonData = [];
  if (req.params.status === "T") {
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
        $unwind: "$Client",
      },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
        },
      },
    ]).then((Data) => {

      for (let i = 0; i < Data.length; i++) {
        if (Data[i].User.length === 0) {
          JsonData.push({
            _id: Data[i]._id,
            client: Data[i].Client.Name,
            entrega: Data[i].DeliveryDate,
            prioridade: Data[i].Priority,
            Status: Data[i].Status.Status,
            User: "",
          });
        } else {
          JsonData.push({
            _id: Data[i]._id,
            client: Data[i].Client.Name,
            entrega: Data[i].DeliveryDate,
            prioridade: Data[i].Priority,
            Status: Data[i].Status.Status,
            User: Data[i].User[0].Name,
          });
        }
      }

      res.json(JsonData);
    });
  } else {
    ProductionModel.aggregate([
      {
        $match: {
          "Status.Status": req.params.status,
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
      {
        $unwind: "$Client",
      },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "_id",
          as: "User",
        },
      },
    ]).then((Data) => {
      
      // console.log(Data[2].User)
      // return
      for (let i = 0; i < Data.length; i++) {
        if (Data[i].User.length === 0) {
          JsonData.push({
            _id: Data[i]._id,
            client: Data[i].Client.Name,
            entrega: Data[i].DeliveryDate,
            prioridade: Data[i].Priority,
            Status: Data[i].Status.Status,
            User: "",
          });
        } else {
          JsonData.push({
            _id: Data[i]._id,
            client: Data[i].Client.Name,
            entrega: Data[i].DeliveryDate,
            prioridade: Data[i].Priority,
            Status: Data[i].Status.Status,
            User: Data[i].User[0].Name,
          });
        }
      }

      res.json(JsonData);
    });
  }

  /*
  cliente Nome
  Entrega
  Prioridade
  Status
  ID


  */
});

// -------------------------------------------
// ----------------------------- Recipe
Router.get("/Recipe/:id", (req, res) => {
  ProductModel.findOne(
    { _id: req.params.id },
    { Recipe: 1, Description: 1 }
  ).then((Product) => {
    res.json(Product);
  });
});

Router.post("/SaveRecipe", (req, res) => {
  try {
    ProductModel.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          Recipe: req.body.Recipe[0],
        },
      },
      {
        returnNewDocument: true,
      },
      (err, results) => {
        // In this moment, you recive a result object or error
        if (err) {
          console.log(err);
        }
        if (results) {
          res.send(true);
        }
        // ... Your code when have result ... //
      }
    );
  } catch (error) {
    console.log(error);
  }
});

Router.post("/DeletRecipe", (req, res) => {
  ProductModel.findOneAndUpdate(
    { _id: req.body._id },
    { $pull: { Recipe: {} } },
    {
      returnNewDocument: true,
    },
    (err, results) => {
      // In this moment, you recive a result object or error
      if (err) {
        console.log(err);
      }
      if (results) {
        res.send(true);
      }
      // ... Your code when have result ... //
    }
  );
});

Router.get("/AllSeedStock", (req, res) => {
  ProductModel.find(
    {
      $and: [{ $or: [{ Type: "S" }, { Type: "B" }] }],
    },
    { Description: 1 }
  ).then((Product) => {
    res.json(Product);
  });
});

Router.get("/GetMeasureFeedStock/:id", (req, res) => {
  ProductModel.aggregate([
    {
      $lookup: {
        from: "measures",
        localField: "Measure",
        foreignField: "_id",
        as: "Measure",
      },
    },
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },

    { $project: { "Measure.Abbreviation": 1 } },
  ]).then((Product) => {
    res.json(Product);
  });
});

// -------------------------------------------
// ------------------------------- HOME

Router.get("/Home", (req, res) => {
  let Dados = [];

  ClientModel.find()
    .countDocuments()
    .then((ClientData) => {
      Dados.push(ClientData);
      ProductModel.find()
        .countDocuments()
        .then((ProductData) => {
          Dados.push(ProductData);
          ProductionModel.find({ "Status.Status": "A" })
            .countDocuments()
            .then((PendenteData) => {
              Dados.push(PendenteData);
              ProductionModel.find({ "Status.Status": "F" })
                .countDocuments()
                .then((DeliveryData) => {
                  Dados.push(DeliveryData);
                  res.json(Dados);
                });
            });
        });
    });
});

// -------------------------------------------------------

Router.get("/Estado/:uf", (req, res) => {
  EstadosModel.find({ sigla_uf: req.params.uf }, { cidades: 1 })
    .then((Data) => {
      res.json(Data);
    })
    .catch((err) => {
      res.json(err);
    });
});
// ------------------------------------------------ Supplier
// API
Router.get("/Supplier/GetCNPJ/:cnpj", (req, res) => {
  axios({
    method: "GET",
    url:
      "https://consulta-cnpj-gratis.p.rapidapi.com/companies/" +
      req.params.cnpj,
    headers: {
      "content-type": "application/octet-stream",
      "x-rapidapi-host": "consulta-cnpj-gratis.p.rapidapi.com",
      "x-rapidapi-key": process.env.API_KEY_CNPJ,
      useQueryString: true,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.send('{"Status":"error"}');
    });
});

Router.post("/Supplier/Add", (req, res) => {
  const NewSupplier = {
    Tipo: req.body.Tipo,
    RazaoSocial: req.body.RazaoSocial,
    NomeFantasia: req.body.NomeFantasia,
    CNPJ: req.body.CNPJ,
    InscEstadual: req.body.InscEstadual,
    InscMun: req.body.InscMun,
    Celular: req.body.Celular,
    CelularAlt: req.body.CelularAlt,
    Email: req.body.Email,
    CEP: req.body.CEP,
    Logradouro: req.body.Logradouro,
    Numero: req.body.Numero,
    Complemento: req.body.Complemento,
    Bairro: req.body.Bairro,
    Estado: req.body.Estado,
    Cidade: req.body.Cidade,
  };

  new SupplierModel(NewSupplier)
    .save()
    .then(() => {
      res.send("saved");
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.get("/Supplier", (req, res) => {
  SupplierModel.find()
    .then((Data) => {
      res.json(Data);
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.get("/Supplier/Grid", (req, res) => {
  SupplierModel.find(
    {},
    { NomeFantasia: 1, RazaoSocial: 1, Estado: 1, Cidade: 1, CNPJ: 1 }
  )
    .then((Data) => {
      res.send(Data);
    })
    .catch((err) => {
      res.send(err);
    });
});

Router.get("/Supplier/:cnpj", (req, res) => {
  let CNPJ = req.params.cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );

  SupplierModel.aggregate([
    {
      $match: {
        CNPJ: CNPJ,
      },
    },
    {
      $unwind: "$Produtos",
    },
    {
      $lookup: {
        from: "products",
        localField: "Produtos.CodProduct",
        foreignField: "_id",
        as: "ProductsLinked",
      },
    },
  ])
    .then((Data) => {
      let ArrayProductsLinked = [];

      // If doesn't exist any products registered, then we need to do a search again, if existe any supplier register, i'll do return to browser
      if (Data.length === 0) {
        SupplierModel.findOne({ CNPJ: CNPJ }, { CNPJ: 1, _id: 0 })
          .then((Data1) => {
            ArrayProductsLinked.push({
              CNPJ: Data1.CNPJ,
            });
            res.send(ArrayProductsLinked);
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        // if exist 1 or more product registered, we need do a loop and fill the array and send to browser
        for (let i = 0; i < Data.length; i++) {
          ArrayProductsLinked.push({
            CNPJ: Data[i].CNPJ,
            Product: {
              CodProduct: Data[i].Produtos.CodProduct,
              CodSupplier: Data[i].Produtos.CodSupplier,
              Description: Data[i].ProductsLinked[0].Description,
            },
          });
        }
        res.send(ArrayProductsLinked);
      }
    })
    .catch((err) => {
      res.send(err);
    });
});
// -------------------------------------------------- Purchase

Router.post("/LinkProduct", (req, res) => {
  let CNPJ = req.body.CNPJSupplier.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );

  SupplierModel.findOne({ CNPJ: CNPJ }, { Produtos: 1 })
    .then((Data) => {
      const LinkProduct = {
        CodProduct: mongoose.Types.ObjectId(req.body.IdProduct),
        CodSupplier: req.body.CodSupplier,
      };

      Data.Produtos.push(LinkProduct);

      Data.save()
        .then(() => {
          res.send("success");
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// -------------------------------------------------- Transactions Nature
Router.post("/Transaction/New", (req, res) => {
  if (req.body.Description === "") return;
  if (req.body.Transition === "") return;

  const NewTransactionNature = req.body;

  new TransactionNature(NewTransactionNature)
    .save()
    .then(() => {
      res.send("saved");
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = Router;
