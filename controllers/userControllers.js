const formValid = require("../validation/formValidation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const passport = require("passport");

require("../authentication/passport/local");

module.exports.getUserLogin = (req, res) => {
  res.render("pages/login", { title: "Login" });
};

module.exports.getUserLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
    req.flash("success", "Successfully Logout");
  });
};

module.exports.getUserRegister = (req, res) => {
  res.render("pages/register", {
    title: "Register",
    errors: [],
    username: "",
    password: "",
  });
};

module.exports.postUserLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
};

module.exports.postUserRegister = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const errors = [];
  const validationErrors = formValid.registerValidation(username, password);

  if (validationErrors.length > 0) {
    return res.render("pages/register", {
      title: "Register",
      username,
      password,
      errors: validationErrors,
    });
  }

  // Server side validation
  User.findOne({ username }).then((user) => {
    if (user) {
      errors.push({ message: "Username Already In Use" });
      return res.render("pages/register", {
        title: "Register",
        username,
        password,
        errors,
      });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) throw err;
        const newUser = new User({
          username: username,
          password: hash,
        });
        newUser
          .save()
          .then(() => {
            req.flash("flashSuccess", "Successfully Registered");
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      });
    });
  });
};
