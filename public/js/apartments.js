window.addEventListener("load", function(){

    // *********** Recursos ***********
    const container = document.getElementById("container");
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");
    const buildingSelect = document.getElementById("building-select");
    const addApartment = document.getElementById("add-apartment");

    const spinner = createSpinner();
    const noResults = createNoResults();
    const selectABuilding = createSelectABuilding();

    let currentPage = 0;

    // *********** Utilidades ***********
    function apiCall(url, callback){ // LLamados GET a la API
        fetch(url)
            .then(response => response.json())
            .then(result => callback(result));
    }

    function buildSelect(){ // Creación del selector de edificios
        apiCall("/api/buildings/all", result => {
            let content = "";

            result.data.forEach(element => {
                content +=   `<option value="${element.id}">
                                ${element.name}
                            </option>`;
            });

            buildingSelect.innerHTML += content;
        });
    }

    function loadTable(page){ // Armado de la tabla
        let buildingId = buildingSelect.value;

        if(buildingId != "") {
            // Borrado del cartel de "seleccione un edificio"
            if(container.querySelector("#select-a-building") != null){
                container.removeChild(selectABuilding);
            }

            tableBody.appendChild(spinner);

            apiCall(`/api/apartments/list?page=${page}&b=${buildingId}`, (result) => {
                let content = "";

                if(result.meta.count != 0){
                    // Borrado del cartel de "sin resultados"
                    if(container.querySelector("#no-results") != null){
                        container.removeChild(noResults);
                    }
    
                    result.data.forEach(element => {
                        const initDate = new Date(element.initDate);
                        const endDate = new Date(element.endDate);

                        content += 
                            `<tr class="text-center">
                                <th>${element.name}</th>
                                <td>${initDate.toLocaleDateString()} 
                                    <br/> 
                                    ${endDate.toLocaleDateString()}
                                </td>
                                <td>${element.price}</td>
                                <td>
                                    <a href="/admin/apartments/${element.id}">
                                        <i class="fas fa-eye"></i>
                                    <a>
                                </td>
                            </tr>`;
                    });
                } else {
                    container.appendChild(noResults);
                }

                // Rellenado de la tabla
                tableBody.removeChild(spinner);
                tableBody.innerHTML = content;

                // Suscripción a eventos de los botones de borrado
                for(row of tableBody.children){
                    let lastCol = row.children.item(row.children.length - 1);
                    
                    lastCol.addEventListener("click", () => deleteApartment(lastCol.dataset.id));
                }
            });
        } else {
            tableBody.innerHTML = "";
            container.appendChild(selectABuilding);
        }
    }

    function deleteApartment(id){ // Borrado AJAX del departamento
        // TODO : Mostrar algún tipo de popup de confirmación
        // TODO : Que el paginado reaccione al cambio de elementos
        fetch(`/api/apartments/delete/${id}`, { method : "DELETE" })
            .then(response => {
                loadTable(currentPage);
            });
    }

    function buildPagination(buildingId){ // Armado del paginado
        apiCall(`/api/apartments/pages?b=${buildingId}`, (result) => {
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
            } else pagination.innerHTML = "";
        });
    }

    function createSelectABuilding() {
        const selectABuilding = document.createElement("div");
        selectABuilding.classList.add("text-center");
        selectABuilding.id = "select-a-building";

        const img = document.createElement("img");
        img.src = "/img/gecons.png";
        img.alt = "Logo de Gecons";
        selectABuilding.appendChild(img);

        const h3 = document.createElement("h3");
        h3.innerHTML = "<i class='fas fa-arrow-circle-up'>Seleccione un edificio</i>";
        selectABuilding.appendChild(h3);

        return selectABuilding;
    }

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

    function createSpinner(){ // Retorna un elemento con el comportamiento del spinner
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

    // *********** Suscripción a eventos ***********
    addApartment.addEventListener("click", () => {
        if(buildingSelect.value != ""){
            window.location.href = `/admin/apartments/add?b=${buildingSelect.value}`;
        }
        // TODO : Dar un aviso visual al seleccionar el primero
    });

    buildingSelect.addEventListener("change", function(){
        currentPage = 1;
        loadTable(1);
        buildPagination(this.value);

    })

    // *********** Construcción de la página ***********
    buildSelect();
    loadTable(1);
});