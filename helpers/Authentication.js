const Handlebars                       = require('handlebars');

module.exports = {
  Authentication: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      // req.flash("MsgError", "unauthorized access");
      res.redirect("/Login");
    },
  };