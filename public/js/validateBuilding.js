window.addEventListener("load", () => {

    let errors = {}; // Errores de validación

    // *********** Recursos ***********
    const name = document.getElementById("name");
    const password = document.getElementById("password");
    const oldPassword = document.getElementById("oldPassword");
    const sendTo = document.getElementById("send-to");
    const form = document.querySelector("form");
    const showPassword = document.getElementById("show-password");
    const showOldPassword = document.getElementById("show-oldPassword");
    const autogenerate = document.getElementById("autogenerate");

    // *********** Comportamiento ***********
    autogenerate.addEventListener("click", () => {
        let randomPwd = "";

        while(randomPwd.length < 18){
            switch(randomInt(0,2)){
                case 0: // Minúscula
                    randomPwd += String.fromCharCode(randomInt(97, 122));
                    break;
                case 1: // Mayúscula
                    randomPwd += String.fromCharCode(randomInt(65, 90));
                    break;
                default: // Número
                    randomPwd += randomInt(0, 9);
                    break;
            }
            if(randomPwd.length == 18 && !pwdCheck(randomPwd)) randomPwd = "";
        }

        password.value = randomPwd;
        validatePassword(); // Validación de la contraseña recién generada
    });

    function togglePassword(){
        // Cambio del ícono
        this.children.item(0).classList.toggle("fa-eye-slash");
        this.children.item(0).classList.toggle("fa-eye");
        
        if(this.parentElement.nextElementSibling.type == "password") 
            this.parentElement.nextElementSibling.type = "text";
        else this.parentElement.nextElementSibling.type = "password";
    }

    // *********** Utilidades ***********
    function randomInt(min, max){
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    function pwdCheck(password){
        let hasUpper = new RegExp("[A-Z]");
        let hasLower = new RegExp("[a-z]");
        let hasNumber = new RegExp("[0-9]");
        
        return hasNumber.test(password) && hasUpper.test(password) && hasLower.test(password);
    }

    function handleFeedback(element, feedback){ // Remarca los errores
        if(feedback){
            element.classList.add("alert", "alert-danger");
            errors[element.name] = feedback;
        } else {
            element.classList.remove("alert", "alert-danger");
            delete errors[element.name];
        }
    }

    // *********** Validaciones ***********
    function validateName(){
        let feedback = false;
        name.value = name.value.trim();

        if(name.value == "" || name.value.length > 191) feedback = true;

        handleFeedback(name, feedback);
    }

    function validatePassword(){
        let feedback = false;

        if(password.value.length < 8 || password.value.length > 18
            || !pwdCheck(password.value)) feedback = true;

        handleFeedback(password, feedback);
    }

    function validateOldPassword(){
        let feedback = false;

        if(oldPassword.value.length == 0) feedback = true;

        handleFeedback(oldPassword, feedback);
    }

    function validateSendTo(){
        let feedback = false;
        sendTo.value = sendTo.value.trim();
        // Expresión regular para validar la estructura del email
        let regexpEmail = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

        if(sendTo.value != "" && !regexpEmail.test(sendTo.value)) feedback = true;

        handleFeedback(sendTo, feedback);
    }

    // *********** Suscripción a eventos ***********
    name.addEventListener("blur", validateName);
    password.addEventListener("blur", validatePassword);
    sendTo.addEventListener("blur", validateSendTo);
    showPassword.addEventListener("click", togglePassword);

    if(showOldPassword) showOldPassword.addEventListener("click", togglePassword);
    if(oldPassword) oldPassword.addEventListener("blur", validateOldPassword);

    form.addEventListener("submit", function(event){
        // Checkeo pre-envío
        validateName();
        validatePassword();
        validateSendTo();
        if(oldPassword) validateOldPassword();
        
        if(Object.keys(errors).length) event.preventDefault(); // Cancelación del evento
        else if(password.type == "text") password.type = "password";
    });

});