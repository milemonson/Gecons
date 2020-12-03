const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/apartmentController");

router.get("/list", controller.listAll);

router.get("/pages", controller.getPages);

router.get("/download/:id", controller.downloadDocument);

router.delete("/delete/:id", controller.delete);

module.exports = router;