const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/apartmentController");
const adminAPIRoute = require("../../middlewares/api/adminAPIRoute");
const userAPIRoute = require("../../middlewares/api/userAPIRoute");

router.get("/list", userAPIRoute, controller.listAll);

router.get("/pages", userAPIRoute,controller.getPages);

// Borrado de recursos a través de la API
router.delete("/document", adminAPIRoute,controller.deleteDocument);
router.delete("/image", adminAPIRoute,controller.deleteImage);

module.exports = router;