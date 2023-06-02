const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }).then((user, err) => {
      if (err) return done(err, null, "Bir hata Oluştu");
      if (!user) return done(null, false, "User Not Found");
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user, "Successfully Logged In");
        } else {
          return done(null, false, "Incorrect Password");
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id).then((user, err) => {
    return done(err, user);
  });
});
