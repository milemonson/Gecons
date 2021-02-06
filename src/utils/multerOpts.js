/**
 * Motor de subida de archivos para Multer.
 */
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "tmp");

let storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
        cb(null, TEMP_DIRECTORY);
    },

    filename: function (req, file, cb) {
        //       images/docs       -   milisegundos   -     3 1ras letras                      .ext
        cb(null, file.fieldname + '-' + Date.now() + '-'  + file.originalname.substring(0,3) + path.extname(file.originalname));

    }
});

module.exports = { storage : storage }