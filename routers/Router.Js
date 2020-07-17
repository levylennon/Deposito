const express = require("express");
const MainRouter = express.Router();
const MainRouters = require("./MainRouters");
const Product = require("./ProductRouters");
const User = require("./UserRouters");
const Api = require("./ApiRouters");
const Recipe = require("./RecipeRouters");
const Measure   = require("./MeasureRouter");
const Stock  = require("./StockRouters");
const Production  = require("./ProductionRouters");
const Client  = require("./ClientRouters");
const Delivery  = require("./DeliveryRouters");
const employee  = require("./EmployeeRouters");
const Purchase  = require("./PurchaseRouters")
const Driver  = require("./DriverRouters");
const Supplier  = require("./SupplierRouter");

MainRouter.use("/", MainRouters);
MainRouter.use("/Api", Api);
MainRouter.use('/Product', Product)
MainRouter.use("/Measure", Measure);
MainRouter.use("/Stock", Stock);
MainRouter.use("/User", User);
MainRouter.use("/Recipe", Recipe);
MainRouter.use('/Production', Production)
MainRouter.use("/Client", Client);
MainRouter.use("/Delivery", Delivery);


// Routers employee production
MainRouter.use("/Funcionario", employee);
// Driver's Routers
MainRouter.use("/Motorista", Driver);

// develop
MainRouter.use("/Purchase", Purchase);
MainRouter.use("/Supplier", Supplier);





module.exports = MainRouter;