const express = require("express");
const router = express.Router();
const {
  getUserLogin,
  getUserRegister,
  postUserLogin,
  postUserRegister,
  getUserLogout,
} = require("../controllers/userControllers");

router.get("/login", getUserLogin);

router.get("/register", getUserRegister);

router.get("/logout", getUserLogout);

router.post("/login", postUserLogin);

router.post("/register", postUserRegister);

module.exports = router;
