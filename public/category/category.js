function add_profile(event) {
    event.preventDefault();
    const div = document.querySelector('.modal-category');
    div.innerHTML += 
    `<div class="mb-3">
        <label for="">Adicionar username de perfil</label>
        <div class="d-flex gap-2">
            <input type="text" class="form-control" name="profile[]" placeholder="username..">
            <button onclick="remove_profile(event)" type="button" class="btn btn-danger"><i class="bi bi-x-lg"></i></button>
        </div> 
    </div>`
}

function remove_profile(event) {
    const element = event.currentTarget.parentNode.parentNode;
    element.remove();
}

function actionDetails(event) {
    const card = document.querySelector('.card-details');
    const tableContent = document.querySelector('.table-content');

    if (card.classList.contains('visible')) {
        card.classList.remove('visible');
        card.classList.add('hide');
        card.style.display = 'none';
        tableContent.style.marginRight = '0';
    } else {
        card.style.display = 'block';
        card.classList.remove('hide');
        card.classList.add('visible');
        tableContent.style.marginRight = '320px';
    }
}