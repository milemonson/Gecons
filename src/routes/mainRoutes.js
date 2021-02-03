const express = require("express");
const controller = require("../controllers/mainController");
const loginValidator = require("../validators/loginValidator");
const router = express.Router();

router.get("/", controller.index);

router.get("/login", controller.login);

router.post("/login", loginValidator, controller.authenticate);

// Envío de mails
router.post("/contact-mail", controller.contactMail);
router.post("/apartment-mail", controller.apartmentMail);

module.exports = router;