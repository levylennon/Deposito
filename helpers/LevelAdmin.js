module.exports = {
  isAdmin: (req, res, next) => {
    if(req.isAuthenticated() && req.user.Level == 2){
      return next();
    }
    // req.flash("MsgError", "Sem permissão!");
    res.redirect("/Login");
  },
};
