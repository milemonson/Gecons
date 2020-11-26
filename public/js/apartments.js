window.addEventListener("load", function(){

    // *********** Recursos ***********
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");
    const buildingSelect = document.getElementById("building-select");
    const addApartment = document.getElementById("add-apartment");

    let currentPage = 0;

    // *********** Utilidades ***********
    function apiCall(url, callback){ // LLamados GET a la API
        fetch(url)
            .then(response => response.json())
            .then(result => callback(result));
    }

    function buildSelect(){ 
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

    function loadTable(page){
        let buildingId = buildingSelect.value;

        if(buildingId != ""){
            tableBody.innerHTML = ""; // Vaciado de la tabla

            apiCall(`/api/apartments/list?page=${page}&b=${buildingId}`, (result) => {
                let content = "";

                result.data.forEach(element => {
                    content += 
                        `<tr>
                            <th>${element.name}</th>
                            <td>${element.initDate}</td>
                            <td>${element.endDate}</td>
                            <td>${element.price}</td>
                            <td>
                                <a href="/admin/apartments/${element.id}/edit">
                                    <i class="fas fa-edit"></i>
                                <a>
                            </td>
                            <td data-id="${element.id}">
                                <i class="fas fa-trash-alt"></i>
                            </td>
                        </tr>`;
                });

                tableBody.innerHTML = content;
            });
        }
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
});