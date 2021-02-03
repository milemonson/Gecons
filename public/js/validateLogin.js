window.addEventListener("load", () => {

    let errors = {}; // Errores de validación

    // *********** Recursos ***********
    const user = document.getElementById("user");
    const password = document.getElementById("password");
    const form = document.querySelector("form");

    // *********** Funciones de validación ***********
    // TODO : Crear clases para mostrar errores
    function handleFeedback(element, feedback){ // Manejo de validaciones
        if(feedback){
            element.classList.add("alert", "alert-danger");
            errors[element.name] = feedback;
        } else {
            element.classList.remove("alert", "alert-danger");
            delete errors[element.name];
        }
    }

    function validateUser() {
        let feedback = false;
        user.value = user.value.trim();

        if(user.value == "" || user.value.length == 191) feedback = true;

        handleFeedback(user, feedback);
    }

    function validatePassword() {
        let feedback = false;

        if(password.value == "") feedback = true;

        handleFeedback(password, feedback);
    }

    // *********** Suscripción a eventos ***********
    user.addEventListener("blur", validateUser);
    password.addEventListener("blur", validatePassword);

    form.addEventListener("submit", function(event) {
        validateUser();
        validatePassword();

        if(Object.keys(errors).length) event.preventDefault(); // Cancelación del envío
    });

});