window.addEventListener("load", function(){

    // *********** Recursos ***********
    const container = document.getElementById("container");
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");
    const filter = document.getElementById("filter");
    const searchButton = document.getElementById("search-button");
    // Spinner de carga
    const spinner = createSpinner();
    // Feedback sin resultados
    const noResults = createNoResults();

    let currentPage = 1;

    // LLamado a la API
    function apiCall(url, callback){
        fetch(url)
            .then(response => response.json())
            .then(result => callback(result));
    }

    // Llenado de la tabla
    function loadTable(page){
        tableBody.appendChild(spinner);

        apiCall(`/api/buildings/list?page=${page}&filter=${filter.value}`, (result) => {
            
            tableBody.removeChild(spinner);
            let content = "";

            if(result.meta.count != 0){
                // Borrado del cartel de "sin resultados"
                if(container.querySelector("#no-results") != null){
                    container.removeChild(noResults);
                }

                result.data.forEach(element => {
                    content += 
                        `<tr>
                            <th>
                                <a href="/admin/apartments/list/${element.id}">${element.name}</a>
                            </th>
                            <td>${element.apartments}</td>
                            <td>
                                <a href="/admin/buildings/${element.id}/edit">
                                    <i class="fas fa-edit"></i>
                                <a>
                            </td>
                            <td data-id="${element.id}"><i class="fas fa-trash-alt"></i></td>
                        </tr>`;
                });
            } else {
                container.appendChild(noResults);
            }

            // Rellenado de la tabla
            tableBody.innerHTML = content;

            // Suscripción a eventos de los botones de borrado
            for(row of tableBody.children){
                let lastCol = row.children.item(row.children.length - 1);
                
                lastCol.addEventListener("click", () => deleteBuilding(lastCol.dataset.id));
            }
        });
    }

    // Borrado desde la API
    function deleteBuilding(id){
        // TODO : Mostrar algún tipo de popup de confirmación
        // TODO : Que el paginado reaccione al cambio de elementos
        fetch(`/api/buildings/delete/${id}`, { method : "DELETE" })
            .then(response => {
                loadTable(currentPage);
            });
    }

    // Armado del paginado
    // TODO : Contemplar el caso en el que haya demasiadas pestañas
    function buildPagination(){

        apiCall(`/api/buildings/pages?filter=${filter.value}`, (result) => {
            if(result.meta.count > 1){
                let content =  "";

                for(let i = 1; i <= result.meta.count; i++){
                    content += `<li class="page-item ${i == 1 ? 'active' : ''}">
                                    <a class="page-link" href="#" id="tab-${i}"">
                                        ${i}
                                    </a>
                                </li>`;
                }

                pagination.innerHTML = content;

                // Suscripción a eventos de cambio de página
                document.querySelectorAll("a.page-link").forEach(link => {
                    link.addEventListener("click", function(e){
                        e.preventDefault();
                        let tab = Number(this.innerHTML); // Número de la página

                        if(currentPage != tab){
                            document.getElementById(`tab-${currentPage}`).parentElement.classList.toggle("active")
                            this.parentElement.classList.toggle("active");

                            currentPage = tab;
                            loadTable(tab);
                        }
                    })
                });
            }
        });
    }

    // Refrescado de la tabla
    function refreshTable() {
        loadTable(currentPage);
        buildPagination();
    }

    // *********** Suscripción a eventos de filtrado ***********
    filter.addEventListener("blur", () => refreshTable());
    filter.addEventListener("keydown", (event) => {
        if(event.key == "Enter"){
            refreshTable();
        }
    });
    searchButton.addEventListener("click", () => refreshTable());

    // *********** Creación de elementos del DOM ***********
    function createNoResults(){
        const noResults = document.createElement("div");
        noResults.classList.add("text-center");
        noResults.id = "no-results";

        const img = document.createElement("img");
        img.src = "/img/gecons.png";
        img.alt = "Logo de Gecons";
        noResults.appendChild(img);

        const h3 = document.createElement("h3");
        h3.innerText = "No hubo resultados...";
        noResults.appendChild(h3);

        return noResults;
    }

    function createSpinner(){
        const spinner = document.createElement("div");
        // Estilos
        spinner.style.border = "10px solid rgb(111,111,111)";
        spinner.style.borderTop = "10px solid rgb(17,76,118)";
        spinner.style.borderRadius = "50%";
        spinner.style.width = "70px";
        spinner.style.height = "70px";
        spinner.style.animation = "spin 2s linear infinite";
        spinner.style.position = "relative";
        spinner.style.left = "150%";
        spinner.style.marginTop = "15px";

        return spinner;
    }

    // *********** Inicialización de la vista ***********
    refreshTable();

});