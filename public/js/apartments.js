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

    // *********** Suscripción a eventos ***********
    addApartment.addEventListener("click", () => {
        if(buildingSelect.value != ""){
            window.location.href = `/admin/apartments/add?b=${buildingSelect.value}`;
        }
        // TODO : Dar un aviso visual al seleccionar el primero
    });

    // *********** Construcción de la página ***********
    buildSelect();
});