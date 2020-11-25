const express = require("express");
const router = express.Router();
const controller = require("../controllers/apartmentController");
const createApartmentValidator = require("../validators/createApartmentValidator");

// Listado
router.get("/", controller.show);

// Creación
router.get("/add", controller.create);
router.post("/add", createApartmentValidator, controller.store);

// Edición
router.get("/:id/edit", controller.edit);
router.put("/:id/edit", controller.update);

module.exports = router;