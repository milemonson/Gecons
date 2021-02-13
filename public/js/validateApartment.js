window.addEventListener("load", function(){
    
    let errors = {}; // Errores de validación

    // *********** Recursos ***********
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const doc = document.getElementById("doc");
    const images = document.getElementById("images");
    const form = document.querySelector("form");
    // Borrado de archivos
    const imgShower = document.getElementById("img-shower");
    const documentsContainer = document.getElementById("documents-container");

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

    function filesFeedback(){
        let msg = "";

        if(this.files.length > 1){
            msg = this.files.length + " archivos seleccionados."
        } else {
            msg = "1 archivo seleccionado."
        }

        this.nextElementSibling.innerHTML = msg;
    }

    // *********** Validaciones ***********
    function validateName(){
        let feedback = false;
        name.value = name.value.trim();

        if(name.value == "" || name.value.length > 500) feedback = true;

        handleFeedback(name, feedback);
    }

    function validateDescription(){
        let feedback = false;
        description.value = description.value.trim();

        if(description.value != "" && description.value.length > 1000) feedback = true;

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
    if(documentsContainer){ // Borrado asincrónico de documentos
        document.querySelectorAll(".delete-document").forEach(element => {
            let parentContainer = element.parentElement;
            element.addEventListener("click", function(){
                fetch(`/api/apartments/document?id=${this.dataset.id}&doc=${this.dataset.url}`,
                    { method : "DELETE" })
                    .then(() => {
                        documentsContainer.removeChild(parentContainer);
                    });
            });
        });
    }

    if(imgShower){ // Borrado asincrónico de imágenes
        document.querySelectorAll(".delete-image").forEach(element => {
            let parentContainer = element.parentElement;
            element.addEventListener("click", function(){
                fetch(`/api/apartments/image?id=${this.dataset.id}&url=${this.dataset.url}`,
                    { method : "DELETE" })
                    .then(() => {
                        imgShower.removeChild(parentContainer);
                        if(imgShower.innerHTML == "")
                            document.removeChild(imgShower);
                    });
            });
        });
    }

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

    // Feedback visual de los archivos seleccionados
    images.addEventListener("change", filesFeedback);
    doc.addEventListener("change", filesFeedback);

});