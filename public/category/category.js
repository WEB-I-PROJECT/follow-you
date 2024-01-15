function add_profile(event) {
    event.preventDefault();
    const div = document.querySelector('.content-category');
    div.innerHTML += 
    `<div class="mb-3">
        <label for="">Adicionar username de perfil</label>
        <div class="d-flex gap-2">
            <input type="text" class="form-control" name="profile[]" placeholder="username..">
            <button type="button" class="btn btn-danger">Excluir</button>
        </div> 
    </div>`
}

function remove_profile(event) {
    
}