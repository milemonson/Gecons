window.addEventListener("load", function(){

    let errors = {}; // Errores de validación

    // *********** Recursos ***********
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const doc = document.getElementById("doc");
    const images = document.getElementById("images");
    const form = document.querySelector("form");

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

    // *********** Validaciones ***********
    function validateName(){
        let feedback = false;
        name.value = name.value.trim();

        if(name.value == "" || name.value.length > 255) feedback = true;

        handleFeedback(name, feedback);
    }

    function validateDescription(){
        let feedback = false;
        description.value = description.value.trim();

        if(description.value != "" && description.value.length > 500) feedback = true;

        handleFeedback(description, feedback);
    }

    function validatePrice(){
        let feedback = false;
        price.value = price.value.trim();

        if(!Number(price.value)) feedback = true;
        else if(price.value < 0) feedback = true;

        handleFeedback(price, feedback);
    }

    // *********** Suscripción a eventos ***********
    name.addEventListener("blur", validateName);
    description.addEventListener("blur", validateDescription);
    price.addEventListener("blur", validatePrice);

    form.addEventListener("submit", function(event){
        // Checkeo pre-envío
        validateName();
        validateDescription();
        validatePrice();

        if(Object.keys(errors).length) event.preventDefault(); // Cancelación del evento
    });

    // Feedback visual de las imágenes selectas
    images.addEventListener("change", function(){
        let msg = "";

        if(this.files.length > 1){
            msg = this.files.length + " archivos seleccionados."
        } else {
            msg = this.files[0].name;
        }

        this.nextElementSibling.innerHTML = msg;
    });

    doc.addEventListener("change", function(){
        this.nextElementSibling.innerHTML = this.files[0].name;
    });

});