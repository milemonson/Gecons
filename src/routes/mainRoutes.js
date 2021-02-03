const express = require("express");
const controller = require("../controllers/mainController");
const loginValidator = require("../validators/loginValidator");
const userRoute = require("../middlewares/userRoute");
const guestRoute = require("../middlewares/guestRoute");
const router = express.Router();

router.get("/", controller.index);

// Sistema de login/logout
router.get("/login", guestRoute, controller.login);
router.post("/login", guestRoute, loginValidator, controller.authenticate);
router.get("/logout", userRoute, controller.logout);

// Envío de mails
router.post("/contact-mail", controller.contactMail);
router.post("/apartment-mail", controller.apartmentMail);

module.exports = router;