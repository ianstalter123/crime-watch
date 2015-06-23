var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Crime.findById(req.params.id, function(err,crime){
      if (crime.ownerId !== req.session.id) {
        res.redirect('/crimes');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/crimes');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;