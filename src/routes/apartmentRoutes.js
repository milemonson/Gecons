const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerOpts = require("../utils/multerOpts");
const controller = require("../controllers/apartmentController");
const createApartmentValidator = require("../validators/createApartmentValidator");
const editApartmentValidator = require("../validators/editApartmentValidator");
const adminRoute = require("../middlewares/adminRoute");
const userRoute = require("../middlewares/userRoute");

const upload = multer(multerOpts);

// Listado
router.get("/list/:bId", userRoute, controller.show);

// Creación
router.get("/add", adminRoute, controller.create);
router.post("/add",
            adminRoute, 
            createApartmentValidator, 
            controller.store);

// Edición
router.get("/:id/edit", adminRoute, controller.edit);
router.put("/:id/edit",
            adminRoute,
            editApartmentValidator,
            controller.update);

// Descarga de documentos
router.get("/download/:doc", userRoute, controller.download);

// Borrado de deptos
router.delete("/delete/:id", adminRoute, controller.delete);

// Detalle del departamento
router.get("/:id", userRoute, controller.detail);

module.exports = router;