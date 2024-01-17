function add_profile(event) {
    event.preventDefault();
    const div = document.querySelector('.modal-category');
    div.innerHTML += 
    `
    <div class="mb-3">
        <label for="">Adicionar username de perfil</label>
        <div class="d-flex gap-2">
            <input type="text" class="form-control" name="profile[]" placeholder="username..">
            <button onclick="remove_profile(event)" type="button" class="btn btn-danger"><i class="bi bi-x-lg"></i></button>
        </div> 
    </div>
    `
}

function remove_profile(event) {
    const element = event.currentTarget.parentNode.parentNode;
    element.remove();
}


function actionDetails(event) {
    const idCategory = event.currentTarget.getAttribute('data-bs-id')
    const card = document.querySelector('.card-details');
    const tableContent = document.querySelector('.table-content');

    fetch(`http://localhost:8001/categoria/details/${idCategory}`).then((response) => {
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }
        return response.json();

    }).then(data => {
        console.log(data);
        console.log(data.profiles);
        card.innerHTML = `
            <div class="title-card">
                <div class="d-flex w-100 justify-content-end">
                    <h5 style="margin-right: 27%;">Categoria</h5>
                    <button type="button" onclick="removeCard(event)" class="btn-close" aria-label="Close"></button>  
                </div>
        
                <h3>${data.category.name}</h3>
            </div>
            <div class="actions">
                <button class="btn btn-warning" onclick="actionDetails(event)"><i class="bi bi-pencil-fill" style="color: white;"></i></button>
                <a href="/categoria/delete/${idCategory}"><button class="btn btn-danger"><i class="bi bi-x-lg"></i></button></a>
            </div>
            <div class="subtitle-card my-3">
                <h3>Perfis</h3>
            </div>
            <div class="content-profile">
                ${data.profiles.map((value, index) => `
                    <div class="profile">
                        <div class="photo p-2">
                            <img src="${value.urlImg}" alt="">
                        </div>
                        <div class="name">
                            <h6 for=""><b>Nome</b></h6>
                            <h6>${value.name}</h6>
                        </div>
                        <div class="username">
                            <h6 for=""><b>username</b></h6>
                            <h6>${value.userIdentify}</h6>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    })
    .catch(error => {
    console.error('Erro ao consultar a API:', error);
    });



    card.style.display = 'block';
    card.classList.remove('hide');
    card.classList.add('visible');
    tableContent.style.marginRight = '320px';
}

function removeCard(params) {
    const card = document.querySelector('.card-details');
    const tableContent = document.querySelector('.table-content');

    if (card.classList.contains('visible')) {
        card.classList.remove('visible');
        card.classList.add('hide');
        card.style.display = 'none';
        tableContent.style.marginRight = '0';
    }
}