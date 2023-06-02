const express = require("express");
const userRouter = require("./routes/user");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const passwort = require("passport");

const User = require("./models/User");
const app = express();

// Flash Middlewares
app.use(cookieParser("passwottutorial"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
    secret: "passworttutorial",
  })
);
app.use(flash());

// password Initialize
app.use(passwort.initialize());
app.use(passwort.session());

// Global - Res.Locals - Middleware
app.use((req, res, next) => {
  // our own flash
  res.locals.flashSuccess = req.flash("flashSuccess");
  res.locals.flashError = req.flash("flashErrors");

  // passport flash
  res.locals.passportFailure = req.flash("error");
  res.locals.passportSuccess = req.flash("success");

  // Our Logged In USER

  res.locals.user = req.user;

  next();
});

// MongoDb Connections
mongoose.connect("mongodb://localhost/passport", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Connected to Database");
});

const PORT = 5000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use(userRouter);
app.get("/", (req, res) => {
  User.find({})
    .then((users) => {
      res.render("pages/index", {
        users,
        title: "Home",
      });
    })
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.render("pages/404", { title: "Not Found" });
});
app.listen(PORT, () => {
  console.log("App Started");
});
