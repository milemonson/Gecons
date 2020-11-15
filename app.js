const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mainRoutes = require("./src/routes/mainRoutes");

// ********** Rutas de la API **********
const apiBuildingRoutes = require("./src/routes/api/buildingRoutes");

const app = express();

// ********** Conf de Express y variables de entorno **********
dotenv.config({path : path.join(__dirname, ".env")});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // Arma el objeto body
app.use(express.json()) // Reconoce los objetos que vienen por medio del request como objetos JSON

// ********** Middlewares a nivel de aplicación **********
app.get("/", mainRoutes);

// ********** Entrada a la API **********
app.use("/api/buildings", apiBuildingRoutes);

// ********** Ejecución del servidor **********
app.listen(process.env.APP_PORT, 
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));