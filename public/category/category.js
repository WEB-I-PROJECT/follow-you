const card = document.querySelector('.card-details');
const tableContent = document.querySelector('.table-content');
const modalCard = document.querySelector('.modal-card');
const contentCategory = document.querySelector('.content-category')

function add_key(event, value) {
    if (event != '') {
        event.preventDefault();
    }
    const valueModal = value == '' ? event.currentTarget.id: value;
    const modal = document.querySelector(`#${valueModal}`);
    const modalBody = modal.querySelector('.modal-category');

    const newDiv = document.createElement('div');
    newDiv.classList.add('mb-3');

    const newLabel = document.createElement('label');
    newLabel.textContent = 'Adicionar palavra chave';

    const newFlexDiv = document.createElement('div');
    newFlexDiv.classList.add('d-flex', 'gap-2');

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.classList.add('form-control');
    newInput.name = 'keywords[]';
    newInput.id = 'keywords';
    newInput.placeholder = 'username..';

    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.classList.add('btn', 'btn-danger');
    newButton.addEventListener('click', remove_profile);
    newButton.innerHTML = '<i class="bi bi-x-lg"></i>';

    newFlexDiv.appendChild(newInput);
    newFlexDiv.appendChild(newButton);
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newFlexDiv);
    modalBody.appendChild(newDiv);
}


function remove_profile(event) {
    const element = event.currentTarget.parentNode.parentNode;
    element.remove();
}

function editCategory(event) {
    const ModalEdit = document.getElementById('ModalEditCategory');
    const button = event.currentTarget;
    const idReference = button.getAttribute('data-bs-whatever');


    fetch(`http://localhost:8001/categoria/details/${idReference}`).then((response) => {

        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }
        return response.json();

    }).then(data => {
        const inputName = ModalEdit.querySelector('.modal-body #name');
        const formEdit = ModalEdit.querySelector('.modal-category');
        inputName.value = data.name;

        if ((ModalEdit.querySelectorAll('.modal-body #keywords')).length != data.keywords.length) {   
            data.keywords.slice(1).forEach(() => add_key('', 'ModalEditCategory'));
        }
        const inputKey = ModalEdit.querySelectorAll('.modal-body #keywords');

        inputKey.forEach((key, index) => key.value = data.keywords[index]);
        formEdit.appendChild(Object.assign(document.createElement('input'), { type: 'hidden', name: 'id', value: idReference }));

    });

}

function actionDetails(event) {
    const idCategory = event.currentTarget.getAttribute('data-bs-id');

    fetch(`http://localhost:8001/categoria/details/${idCategory}`)
        .then(response => {
            if (!response.ok) throw new Error(`Erro de rede: ${response.status}`);
            return response.json();
        })
        .then(data => {
            card.innerHTML = `
                <div class="title-card">
                    <div class="d-flex w-100 justify-content-end">
                        <h5 style="margin-right: 24%; font-weight: bold;">Categoria</h5>
                        <button type="button" onclick="removeCard()" class="btn-close" aria-label="Close"></button>  
                    </div>
                    <div class="photo p-2">
                        <img src="${data.imgPath}" alt="">
                    </div>
                    <h4>${data.name}</h4>
                </div>
                <div class="actions">
                    <button class="btn btn-warning" data-bs-toggle="modal" onclick="editCategory(event)" data-bs-target="#ModalEditCategory" data-bs-whatever="${idCategory}">
                        <i class="bi bi-pencil-fill" style="color: white;"></i>
                    </button>
                    <a href="/categoria/delete/${idCategory}">
                        <button class="btn btn-danger"><i class="bi bi-x-lg"></i></button>
                    </a>
                </div>
                <div class="subtitle-card my-3">
                    <h4>Palavras chaves</h4>
                </div>
                <div class="content-profile">
                    ${data.keywords.map((value, index) => `
                        <div class="keywords">               
                            <div class="key">
                                <h6>${index + 1}-Chave</h6>
                                <h6><b>#${value}</b></h6>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao consultar a API:', error);
        });

    const isMobile = window.outerWidth <= 993;
    const cardClassList = card.classList;

    card.style.display = 'block';
    cardClassList.remove(isMobile ? 'hide-card' : 'hide');
    cardClassList.add(isMobile ? 'visible-card' : 'visible');

    if (isMobile) {
        modalCard.classList.add('visible-modal');
        contentCategory.style.position = 'initial';
    } else {
        tableContent.style.marginRight = '295px';
    }

}


function removeCard() {
    if (card.classList.contains('visible') || (window.outerWidth <= 993)) {
        
        if (window.outerWidth <= 993){
            card.classList.add('hide-card');
            setTimeout(() => {
                card.classList.remove('visible-card');
                modalCard.classList.remove('visible-modal');
                card.style.display = 'none';
                contentCategory.style.position = 'relative';
            }, 470);
        }else {
            card.classList.add('hide');
            tableContent.style.marginRight = '0';
            setTimeout(() => {
                card.classList.remove('visible');
                card.style.display = 'none';
            }, 400);
            
        }   
    }
}

function stopPropagation(event) {
    event.stopPropagation();
}

function searchCategory(event) {

    const categoryId = event.currentTarget.id;
    const url = `/categoria/buscar/${categoryId}`

    const loadingSpinner = document.querySelector('.c-loader');
    loadingSpinner.style.display = 'block';

    fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
        throw new Error(`Erro na solicitação: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Erro:', error);
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });
}

// window.addEventListener("load", function (event) {
//     console.log("Todos os recursos terminaram o carregamento!");
// });