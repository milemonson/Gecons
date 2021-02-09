const express = require("express");
const controller = require("../controllers/mainController");
const loginValidator = require("../validators/loginValidator");
const profileValidator = require("../validators/profileValidator");
const userRoute = require("../middlewares/userRoute");
const guestRoute = require("../middlewares/guestRoute");
const router = express.Router();

router.get("/", controller.index);

// Sistema de login/logout
router.get("/login", guestRoute, controller.login);
router.post("/login", guestRoute, loginValidator, controller.authenticate);
router.get("/logout", userRoute, controller.logout);

// Perfil de administrador
router.get("/profile", controller.profile);
router.put("/profile", profileValidator, controller.putProfile);

// Envío de mails
router.post("/contact-mail", controller.contactMail);
router.post("/apartment-mail", controller.apartmentMail);

module.exports = router;