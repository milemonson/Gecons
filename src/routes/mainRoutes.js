const express = require("express");
const controller = require("../controllers/mainController");
const router = express.Router();

router.get("/", controller.index);
// Envío de mails
router.post("/contact-mail", controller.contactMail);
router.post("/apartment-mail", controller.apartmentMail);

module.exports = router;