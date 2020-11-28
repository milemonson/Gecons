/**
 * Motor de subida de archivos para Multer.
 */
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const TEMP_DIRECTORY = path.join(__dirname, "..", "..", "temp");

let storage = multer.diskStorage({
    
    destination: function (req, file, cb) {

        let tempFilesDir = path.join(TEMP_DIRECTORY,req.body.name);
        let tempImgDir = path.join(tempFilesDir, "img");
        let tempDocDir = path.join(tempFilesDir, "docs");

        if(!fs.existsSync(tempFilesDir)){
            fs.mkdirSync(tempFilesDir);
            fs.mkdirSync(tempImgDir);
            fs.mkdirSync(tempDocDir);
        }

        if(file.fieldname == "images"){ // Imágenes
            cb(null, tempImgDir);
        } else { // Documentos
            cb(null, tempDocDir);
        }
    },

    filename: function (req, file, cb) {
        //       images/docs       -   milisegundos   -     3 1ras letras                      .ext
        cb(null, file.fieldname + '-' + Date.now() + '-'  + file.originalname.substring(0,3) + path.extname(file.originalname));

    }
});

module.exports = { storage : storage }