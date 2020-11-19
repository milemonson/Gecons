const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mainRoutes = require("./src/routes/mainRoutes");
const buildingRoutes = require("./src/routes/buildingRoutes");
const apartmentRoutes = require("./src/routes/apartmentRoutes");

// ********** Rutas de la API **********
const apiBuildingRoutes = require("./src/routes/api/buildingRoutes");

const app = express();

// ********** Conf de Express y variables de entorno **********
dotenv.config({path : path.join(__dirname, ".env")});
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: false })); 
app.use(express.json())

// ********** Middlewares a nivel de aplicación **********
app.use("/", mainRoutes);
app.use("/admin/buildings", buildingRoutes);
app.use("/admin/apartments", apartmentRoutes);

// ********** Entrada a la API **********
app.use("/api/buildings", apiBuildingRoutes);

// ********** Ejecución del servidor **********
app.listen(process.env.APP_PORT, 
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));