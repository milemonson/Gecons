const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/apartmentController");
const adminAPIRoute = require("../../middlewares/api/adminAPIRoute");
const userAPIRoute = require("../../middlewares/api/userAPIRoute");

// Subida de archivos
const multer = require("multer");
const multerOpts = require("../../utils/multerOpts");
const upload = multer(multerOpts);

router.get("/list", userAPIRoute, controller.listAll);

router.get("/pages", userAPIRoute,controller.getPages);

// Subida de archivos a través de la API
router.post("/upload", adminAPIRoute, upload.fields([{ name : "doc" }, { name : "images" }]), controller.uploadFile);
router.delete("/temp", adminAPIRoute, upload.none(), controller.deleteTempFiles);

// Borrado de recursos a través de la API
router.delete("/document", adminAPIRoute, controller.deleteDocument);
router.delete("/image", adminAPIRoute,controller.deleteImage);

module.exports = router;