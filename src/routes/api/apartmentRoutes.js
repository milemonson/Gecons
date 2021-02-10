const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/apartmentController");

router.get("/list", controller.listAll);

router.get("/pages", controller.getPages);

// Borrado de recursos a través de la API
router.delete("/document", controller.deleteDocument);

module.exports = router;