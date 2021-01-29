const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerOpts = require("../utils/multerOpts");
const controller = require("../controllers/apartmentController");
const createApartmentValidator = require("../validators/createApartmentValidator");
const editApartmentValidator = require("../validators/editApartmentValidator");

const upload = multer(multerOpts);

// Listado
router.get("/", controller.show);

// Creación
router.get("/add", controller.create);
router.post("/add", upload.fields([{ name : "doc" }, { name : "images" }]), 
            createApartmentValidator, 
            controller.store);

// Edición
router.get("/:id/edit", controller.edit);
router.put("/:id/edit", upload.fields([{ name : "doc" }, { name : "images" }]), 
            editApartmentValidator,
            controller.update);

// Descarga de documentos
router.get("/download/:doc", controller.download);

// Detalle del departamento
router.get("/:id", controller.detail);

module.exports = router;