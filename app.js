const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const methodOverride = require("method-override");
const mainRoutes = require("./src/routes/mainRoutes");
const buildingRoutes = require("./src/routes/buildingRoutes");
const apartmentRoutes = require("./src/routes/apartmentRoutes");

// ********** Rutas de la API **********
const apiBuildingRoutes = require("./src/routes/api/buildingRoutes");
const apiApartmentRoutes = require("./src/routes/api/apartmentRoutes");

const app = express();

// ********** Conf de Express y variables de entorno **********
dotenv.config({path : path.join(__dirname, ".env")});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); 
app.use(express.json())
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));


// ********** Middlewares a nivel de aplicación **********
app.use("/", mainRoutes);
app.use("/admin/buildings", buildingRoutes);
app.use("/admin/apartments", apartmentRoutes);

// ********** Entrada a la API **********
app.use("/api/buildings", apiBuildingRoutes);
app.use("/api/apartments", apiApartmentRoutes);

// ********** Creación de las carpetas para el guardado de archivos **********
let docsFolder = path.join(__dirname, "docs"); // Documentos descargables
let tempFolder = path.join(__dirname, "temp"); // Carpeta de archivos temporales
let imagesFolder = path.join(__dirname, "public", "img", "uploaded"); // Imágenes subidas

if(!fs.existsSync(docsFolder)) fs.mkdirSync(docsFolder);
if(!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);
if(!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

// ********** Ejecución del servidor **********
app.listen(process.env.APP_PORT, 
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));