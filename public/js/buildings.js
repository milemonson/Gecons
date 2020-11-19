window.addEventListener("load", function(){

    // *********** Recursos ***********
    const tableBody = document.getElementById("table-body");
    const pagination = document.getElementById("pagination");

    let currentPage = 1;

    // LLamado a la API
    function apiCall(url, callback){
        fetch(url)
            .then(response => response.json())
            .then(result => callback(result));
    }

    // Llenado de la tabla
    // TODO : Añadir funcionalidad a los íconos
    function loadTable(page){
        apiCall(`/api/buildings/list?page=${page}`, (result) => {
            let content = "";
            tableBody.innerHTML = ""; // Vaciado de la tabla
            
            result.data.forEach(element => {
                content += 
                    `<tr>
                        <th>${element.name}</th>
                        <td>${element.apartments}</td>
                        <td>
                            <i class="fas fa-edit"></i>
                        </td>
                        <td><i class="fas fa-trash-alt"></i></td>
                    </tr>`;
            });

            tableBody.innerHTML = content;
        });
    }

    // Armado del paginado
    // TODO : Contemplar el caso en el que haya demasiadas pestañas
    function buildPagination(){
        apiCall("/api/buildings/pages", (result) => {
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

    // *********** Carga de la vista ***********
    loadTable(1);
    buildPagination();

});