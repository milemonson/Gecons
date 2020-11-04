const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mainRoutes = require("./src/routes/mainRoutes");

const app = express();

// ********** Conf de Express y variables de entorno **********
dotenv.config({path : path.join(__dirname, ".env")});
app.use(express.static("public"));

// ********** Middlewares a nivel de aplicación **********
app.get("/", mainRoutes);

// ********** Ejecución del servidor **********
app.listen(process.env.APP_PORT, 
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));