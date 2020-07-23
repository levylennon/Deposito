// const app
const express = require("express");
const _handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const bodyParser = require("body-parser");
const app = express();
const port = 8081;
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
// Router
const Router = require("./routers/Router");
// MongoDb
const mongoose = require("mongoose");
// authenticator
const passport = require("passport");
require("./config/auth")(passport);
// moment
var moment = require("moment");
const favicon = require("serve-favicon");


// config
// session
app.use(
  session({
    secret: "JejeIsBadLhuIsGod",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Middleware
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// templates
app.engine(
  "handlebars",
  expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    // create custom helpers here
    helpers: {
      compare: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        var operator = options.hash.operator || "==";

        var operators = {
          "==": function (l, r) {
            return l == r;
          },
          "===": function (l, r) {
            return l === r;
          },
          "!=": function (l, r) {
            return l != r;
          },
          "<": function (l, r) {
            return l < r;
          },
          ">": function (l, r) {
            return l > r;
          },
          "<=": function (l, r) {
            return l <= r;
          },
          ">=": function (l, r) {
            return l >= r;
          },
          typeof: function (l, r) {
            return typeof l == r;
          },
        };

        if (!operators[operator])
          throw new Error(
            "Handlerbars Helper 'compare' doesn't know the operator " + operator
          );

        var result = operators[operator](lvalue, rvalue);

        if (result) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },

      formatTime: function (date, format) {
        let time = moment(date);
        return time.format(format);
      },

      isdefined: function (value) {
        return value !== undefined;
      },

      math: function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue,
        }[operator];
      },
    },
  })
);

app.set("view engine", "handlebars");
// Body Parser
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
// Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/erp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("mongoDB is connected...");
  })
  .catch((err) => {
    console.log("Error : " + err);
  });
// public
app.use(express.static(path.join(__dirname, "/public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// routers
app.use("/", Router);

// server
app.listen(port, () => {
  console.log("server running on port " + port);
});
