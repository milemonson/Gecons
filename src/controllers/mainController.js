const path = require("path");
const { sendMail } = require("../utils/sendMail");

module.exports = {

    index : (req, res) => {
        res.sendFile(path.join(__dirname, "..", "views", "main", "index.html"));
    },

    // Envío de mails desde el formulario de contacto del index
    contactMail : (req, res) => {
        const { email, subject, phone, name, message } = req.body;

        const mail = {
            from : "no-reply@gecons.ar",
            to : email,
            subject : subject,
            body : `${name} \n${phone} \n${message}`
        }

        // TODO : Atajar el error de envío de mails
        sendMail(mail)
            .then(() => {
                res.redirect("/");
            })
            .catch(error => {
                console.log(error);
            });
    },

    // Envío de mails desde la sección de creación de departamentos
    apartmentMail : (req, res) => {
        // TODO : Codear el envío de mails desde la vista de departamentos después del despliegue
    }

}