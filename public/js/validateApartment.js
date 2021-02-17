window.addEventListener("load", function(){
    
    let errors = {}; // Errores de validación

    // *********** Recursos ***********
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const doc = document.getElementById("doc");
    const images = document.getElementById("images");
    const form = document.querySelector("form");
    const submitButton = document.getElementById("submit-button");
    const resetButton = document.getElementById("reset-button");
    // Borrado de archivos
    const imgShower = document.getElementById("img-shower");
    const documentsContainer = document.getElementById("documents-container");

    const filesHistory = { // Registro de archivos subidos
        images : [],
        doc : []
    }

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

    async function uploadFiles(event){ // Subida de archivos asincrónica
        // Bloqueo temporal de elementos
        submitButton.disabled = true;
        resetButton.disabled = true;
        images.disabled = true;
        doc.disabled = true;

        const files = event.target.files;
        const formField = event.target.name;
        const totalFiles = files.length;
        const feedback = this.nextElementSibling;

        try {
            if(filesHistory[formField].length){
                // Borrado de archivos ya subidos
                let data = new FormData();
                data.append("deleteString", filesHistory[formField].toString());
    
                await fetch("/api/apartments/temp",{
                    method : "DELETE",
                    body : data
                });
    
                filesHistory[formField] = [];
            }
            
            // Subida de archivos
            for(let i = 0; i < totalFiles; i ++){
                feedback.innerHTML = `Subiendo archivos... ${i}/${totalFiles}`;
    
                let data = new FormData();
                data.append(formField, files[i]);
                data.append("formField", formField);
                
                let response = await fetch("/api/apartments/upload", {
                    method : "POST",
                    body : data
                })
                .then(result => result.json());
                
                if(response.meta.status == 415) throw new Error("Sólo se soportan imágenes.");
                else filesHistory[formField].push(response.data.filename);
            }
    
            feedback.innerHTML = totalFiles + " archivos seleccionados."
        } catch (error) {
            feedback.innerHTML = error.message;
        }
        

        // Desbloqueo de los elementos
        submitButton.disabled = false;
        resetButton.disabled = false;
        images.disabled = false;
        doc.disabled = false;

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
                this.firstElementChild.innerHTML = '<div class="spinner-border spinner-border-sm"></div>';

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
                element.innerHTML = '<div class="spinner-border spinner-border-sm"></div>';
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

        // Adición de archivos
        if(filesHistory.images.length){
            document.getElementById("associated-images").value = filesHistory.images.toString();
        }

        if(filesHistory.doc.length){
            document.getElementById("associated-docs").value = filesHistory.doc.toString();
        }

        if(Object.keys(errors).length) event.preventDefault(); // Cancelación del evento
    });

    // Feedback visual de los archivos seleccionados
    images.addEventListener("change", uploadFiles);
    doc.addEventListener("change", uploadFiles);

});