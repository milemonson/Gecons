window.addEventListener("load", function () {

    // *********** Recursos ***********
    const container = document.getElementById("container");
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");

    const spinner = createSpinner();
    const noResults = createNoResults();

    const buildingId = Number(tableBody.dataset.building);
    let currentPage = 1;

    // *********** Utilidades ***********
    function apiCall(url, callback) { // LLamados GET a la API
        fetch(url)
            .then(response => response.json())
            .then(result => callback(result));
    }

    function parseDate(date){ // Formateo de fechas a dd/mm/aa
        let parsed = date.split("-");
        return parsed[2] + "/" + parsed[1] + "/" + parsed[0].substring(2,5);
    }

    function loadTable(page) { // Armado de la tabla
        tableBody.innerHTML = "";
        tableBody.appendChild(spinner);

        apiCall(`/api/apartments/list?page=${page}&b=${buildingId}`, (result) => {
            tableBody.removeChild(spinner);
            let content = "";

            if (result.meta.count > 0) {

                result.data.forEach(element => {
                    // Limitación de caracteres para que no se deforme la tabla
                    let name = element.name;
                    if(name.length > 7) name = name.substring(0,5) + "...";

                    let { initDate, endDate, createdAt } = element;
                    
                    content +=
                        `<tr class="text-center">
                            <th class="align-middle">
                                <a href="/admin/apartments/${element.id}">
                                    ${name}
                                <a>
                            </th>
                            <td>${parseDate(initDate)} 
                                <br/> 
                                ${parseDate(endDate)}
                            </td>
                            <td class="align-middle">
                                ${parseDate(createdAt)}
                            </td>
                            <td class="align-middle">${Math.round(element.price)}</td>
                        </tr>`;
                });
            } else {
                container.appendChild(noResults);
            }

            // Rellenado de la tabla
            tableBody.innerHTML = content;
        });
    }

    function buildPagination() { // Armado del paginado
        apiCall(`/api/apartments/pages?b=${buildingId}`, (result) => {
            if (result.meta.count > 1) {
                let content = "";

                for (let i = 1; i <= result.meta.count; i++) {
                    content += `<li class="page-item ${i == 1 ? 'active' : ''}">
                                    <a class="page-link" href="#" id="tab-${i}"">
                                        ${i}
                                    </a>
                                </li>`;
                }

                pagination.innerHTML = content;

                // Suscripción a eventos de cambio de página
                document.querySelectorAll("a.page-link").forEach(link => {
                    link.addEventListener("click", function (e) {
                        e.preventDefault();
                        let tab = Number(this.innerHTML); // Número de la página

                        if (currentPage != tab) {
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

    // *********** Creación de elementos del DOM ***********
    function createNoResults() {
        const noResults = document.createElement("div");
        noResults.classList.add("text-center");
        noResults.id = "no-results";

        const img = document.createElement("img");
        img.src = "/img/gecons.png";
        img.alt = "Logo de Gecons";
        noResults.appendChild(img);

        const h3 = document.createElement("h3");
        h3.innerText = "No hubo resultados...";
        h3.classList.add("h4", "text-dark");
        noResults.appendChild(h3);

        return noResults;
    }

    function createSpinner() { // Retorna un elemento con el comportamiento del spinner
        const spinner = document.createElement("div");
        // Estilos
        spinner.style.border = "10px solid rgb(111,111,111)";
        spinner.style.borderTop = "10px solid rgb(17,76,118)";
        spinner.style.borderRadius = "50%";
        spinner.style.width = "70px";
        spinner.style.height = "70px";
        spinner.style.animation = "spin 2s linear infinite";
        spinner.style.position = "relative";
        spinner.style.marginTop = "15px";
        if(window.screen.width > 360) spinner.style.left = "185%";
        else spinner.style.left = "175%";

        return spinner;
    }

    // *********** Construcción de la página ***********
    buildPagination();
    loadTable(1);

});