const dotenv = require("dotenv");
const path = require("path");
const nodemailer = require("nodemailer");

dotenv.config({ path : path.join(__dirname, "..", "..", ".env") });

// Objeto "transportador" que se encarga de enviar el mail a través de SMTP
// Para tráfico no encriptado usar el puerto 587 y setear "secure" a false
// Para tráfico encriptado usar el puerto 465 y setear "secure" a true
let transporter = nodemailer.createTransport( {
    host : process.env.TRANSPORTER_HOST,
    port : Number(process.env.TRANSPORTER_PORT),
    secure : Boolean(process.env.TRANSPORTER_SECURE),
    auth : {
        user : process.env.TRANSPORTER_AUTH_USER,
        pass : process.env.TRANSPORTER_AUTH_PASS
    }
});

// TODO : Maquetar el mail y reemplaza "text" por "html"
/**
 * Función asíncrona que se encarga del envío de mails a través de un "transportador" 
 * definido a través de las variables de entorno.
 * @param {Object} mail Objeto que contiene los datos del mail, como:
 *                      - from : dirección de envío
 *                      - to : Una lista de mails de destino, separados por coma
 *                      - subject : asunto del mail
 *                      - body : Cuerpo del mensaje
 */
async function main(mail) {
    let info = await transporter.sendMail({
        from: `<${ mail.from }>`,
        to: mail.to,
        subject: mail.subject,
        text : mail.body
    });

    console.log("Mensaje enviado con ID: " + info.messageId);
}

exports.sendMail = main;