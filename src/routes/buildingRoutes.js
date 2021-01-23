const express = require("express");
const router = express.Router();
const controller = require("../controllers/buildingController");
const createBuildingValidator = require("../validators/createBuildingValidator");
const editBuildingValidator = require("../validators/editBuildingValidator");

// Listado
router.get("/", controller.show);

// Creación
router.get("/add", controller.create);
router.post("/add", createBuildingValidator, controller.store);

// Edición
router.get("/:id/edit", controller.edit);
router.put("/:id/edit", editBuildingValidator, controller.update);

module.exports = router;