/**
 * Función destinada a ejecutar los procesos propios de la primera corrida del servidor.
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { Admin } = require("../database/models");

// ********** Creación de las carpetas para el guardado de archivos **********
function createFolders(){
    let docsFolder = path.join(__dirname, "..", "..", "docs"); // Documentos descargables
    let tempFolder = path.join(__dirname, "..", "..", "temp"); // Carpeta de archivos temporales
    let imagesFolder = path.join(__dirname, "..", "..", "public", "img", "uploaded"); // Imágenes subidas
    
    if(!fs.existsSync(docsFolder)) fs.mkdirSync(docsFolder);
    if(!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);
    if(!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);
}

/**
 * Función que se encarga de cargar un usuario administrador por defecto siempre que éste no exista.
 */
async function addAdmin(){
    const DEFAULT_ADMIN = "administracion@gecons.ar";
    const DEFAULT_PWD = "Hola1234";
    const SALT_NUMBER = 12;

    const result = await Admin.findOne({ where : { name : DEFAULT_ADMIN } });

    if(!result) {
        await Admin.create({
            name : DEFAULT_ADMIN,
            password : bcrypt.hashSync(DEFAULT_PWD, SALT_NUMBER)
        })
    }

}

// Función principal
function onFirstRun(){
    addAdmin();
    createFolders();
}

exports.onFirstRun = onFirstRun;