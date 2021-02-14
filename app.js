const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { onFirstRun } = require("./src/utils/onFirstRun");

const mainRoutes = require("./src/routes/mainRoutes");
const buildingRoutes = require("./src/routes/buildingRoutes");
const apartmentRoutes = require("./src/routes/apartmentRoutes");
const apiBuildingRoutes = require("./src/routes/api/buildingRoutes");
const apiApartmentRoutes = require("./src/routes/api/apartmentRoutes");

const autenticateUser = require("./src/middlewares/authenticateUser");
const adminRoute = require("./src/middlewares/adminRoute");
const adminAPIRoute = require("./src/middlewares/api/adminAPIRoute");

// Persistencia de la sesión de usuario en BD
// https://www.npmjs.com/package/connect-session-sequelize
const { sequelize } = require("./src/database/models/index");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStorage = new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 60 * 60 * 24 * 1000,
    expiration: 60 * 60 * 1000
});

const app = express();

// Redireccionamiento HTTP -> HTTPS en producción
if (process.env.NODE_ENV == "production") {
    app.use(function (req, res, next) {
        if ((req.get('X-Forwarded-Proto') !== 'https')) {
            res.redirect('https://' + req.get('Host') + req.url);
        } else
            next();
    });
}

// ********** Configuración de Express **********
dotenv.config({ path: path.join(__dirname, ".env") });
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// ********** Middlewares de autenticación **********
app.use(session({
    secret: "Gecons",
    store: sessionStorage,
    resave: false, // No vuelve a guardarla si no hay cambios
    saveUninitialized: false // No guarda sesiones si todavía no hayan datos
}));
app.use(cookieParser());
app.use(autenticateUser);

sessionStorage.sync(); // Crea ó sincroniza la tabla para la persistencia de la sesión en BD

// ********** Middlewares de ruteo **********
app.use("/", mainRoutes);
app.use("/admin/buildings", adminRoute, buildingRoutes);
app.use("/admin/apartments", apartmentRoutes);

// ********** Acceso a la API **********
app.use("/api/buildings", adminAPIRoute, apiBuildingRoutes);
app.use("/api/apartments", apiApartmentRoutes);

// ********** Ejecución del servidor **********
onFirstRun();

app.listen(process.env.APP_PORT,
    () => console.log(`Escuchando en el puerto ${process.env.APP_PORT}`));