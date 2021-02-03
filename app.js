const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const autenticateUser = require("./src/middlewares/authenticateUser");
const { onFirstRun } = require("./src/utils/onFirstRun");
const mainRoutes = require("./src/routes/mainRoutes");
const buildingRoutes = require("./src/routes/buildingRoutes");
const apartmentRoutes = require("./src/routes/apartmentRoutes");
const adminRoute = require("./src/middlewares/adminRoute");
const userRoute = require("./src/middlewares/userRoute");

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

// ********** Middlewares de autenticación **********
app.use(session({
    secret : "Gecons SA",
    resave: false, // No vuelve a guardarla si no hay cambios
    saveUninitialized: false // No guarda sesiones si todavía no hayan datos
}));
app.use(cookieParser());
app.use(autenticateUser);

// ********** Middlewares de ruteo **********
app.use("/", mainRoutes);
app.use("/admin/buildings", adminRoute, buildingRoutes);
app.use("/admin/apartments", apartmentRoutes);

// ********** Entrada a la API **********
app.use("/api/buildings", apiBuildingRoutes);
app.use("/api/apartments", apiApartmentRoutes);

// ********** Ejecución del servidor **********
onFirstRun();

app.listen(process.env.APP_PORT, 
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));