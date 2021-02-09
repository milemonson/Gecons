window.addEventListener("load", () => {

    let errors = {}

    // *********** Recursos ***********
    const form = document.querySelector("form");
    const oldPassword = document.getElementById("oldPassword");
    const password = document.getElementById("password");
    const autogenerate = document.getElementById("autogenerate");
    const showPassword = document.getElementById("show-password");
    const showOldPassword = document.getElementById("show-oldPassword");

    // *********** Utilidades ***********

    function handleFeedback(element, feedback){ // Remarca los errores
        if(feedback){
            element.classList.add("alert", "alert-danger");
            errors[element.name] = feedback;
        } else {
            element.classList.remove("alert", "alert-danger");
            delete errors[element.name];
        }
    }

    function randomInt(min, max){
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

    function pwdCheck(password){
        let hasUpper = new RegExp("[A-Z]");
        let hasLower = new RegExp("[a-z]");
        let hasNumber = new RegExp("[0-9]");
        
        return hasNumber.test(password) && hasUpper.test(password) && hasLower.test(password);
    }

    function togglePassword(){
        // Cambio del ícono
        this.children.item(0).classList.toggle("fa-eye-slash");
        this.children.item(0).classList.toggle("fa-eye");
        
        if(this.parentElement.nextElementSibling.type == "password") 
            this.parentElement.nextElementSibling.type = "text";
        else this.parentElement.nextElementSibling.type = "password";
    }

    // *********** Validaciones ***********
    function validatePassword(){
        let feedback = false;

        if( password.value.length < 8 || 
            password.value.length > 18 || 
            !pwdCheck(password.value)) feedback = true;

        handleFeedback(password, feedback);
    }

    function validateOldPassword(){
        let feedback = false;
        if(oldPassword.value.length == 0) feedback = true;
        handleFeedback(oldPassword, feedback);
    }

    // *********** Suscripción a eventos ***********
    autogenerate.addEventListener("click", () => {
        let randomPwd = "";

        while(randomPwd.length < 8){
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
            if(randomPwd.length == 8 && !pwdCheck(randomPwd)) randomPwd = "";
        }

        password.value = randomPwd;
        validatePassword(); // Validación de la contraseña recién generada
    });

    password.addEventListener("blur", validatePassword);
    oldPassword.addEventListener("blur", validateOldPassword);
    showPassword.addEventListener("click", togglePassword);
    showOldPassword.addEventListener("click", togglePassword);

    form.addEventListener("submit", function(event){
        // Checkeo pre-envío
        validatePassword();
        validateOldPassword();
        
        if(Object.keys(errors).length) event.preventDefault(); // Cancelación del evento
    });

});