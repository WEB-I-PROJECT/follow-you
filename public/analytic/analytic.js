function toggleFields() {
    const selectedType = document.getElementById("type").value;
    const keywordFields = document.getElementById("keywordFields");
    const categoryField = document.getElementById("categoryField");

    if (selectedType === "by-keywords") {
        keywordFields.style.display = "block";
        categoryField.style.display = "none";
    } else {
        keywordFields.style.display = "none";
        categoryField.style.display = "block";
    }
}

// Function to dynamically add keyword group input fields
let clickCount = 0; // Contador de cliques

function addKeywordGroup() {
    const dynamicKeywordGroups = document.getElementById("groupSession");
    const addKeywordGroupBtn = document.getElementById("addKeywordGroupBtn"); // Certifique-se de ter o ID correto do botão

    // Incrementar o contador de cliques
    clickCount++;

    // Check se o contador atingiu 2
    if (clickCount >= 2) {
        addKeywordGroupBtn.disabled = true;
    }

    // Check se já existem 2 grupos

    const keywordGroupDiv = document.createElement("div");
    keywordGroupDiv.innerHTML = `
    <div class="form-control mt-3">
        <label class="mt-3 text-analytics text-label" for="listName">Nome do Grupo *</label>
        <input type="text"  class="form-control"  name="listName" placeholder="Ex: Nome da lista de palavras chave. Ex: lista sobre o Flamengo">

        <label class="mt-3 text-analytics text-label" for="listSlug">Slug *</label><br>
        <input type="text" class="form-control" name="listSlug" placeholder="Ex: esportes">
        <div id="slugError" class="error-message"></div> 

        <div>
            <!-- Initial keyword group input field -->
            <div class="form-group">
                <label class="mt-3 text-analytics text-label" for="keywords">Palavras chave *</label><br>
                <small class="mb-5 text-analytics">Você só pode adicionar 3 grupos de palavras chave</small>
                <input type="text" class="mb-3 form-control" name="keywords" placeholder="Coloque as palavras separadas por vírgula. Ex: futebol, flamengo, jogos, brasileirão">
            </div>
        </div>
    `;
    dynamicKeywordGroups.appendChild(keywordGroupDiv);
}

const addKeywordGroupBtn = document.getElementById("addKeywordGroupBtn");

document.addEventListener('DOMContentLoaded', function () {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(function (tooltip) {
        const tooltipText = tooltip.getAttribute('data-tooltip');

        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'tooltip-text';
        tooltipElement.textContent = tooltipText;

        tooltip.appendChild(tooltipElement);
    });
});

function validateForm() {
const selectedType = document.getElementById("type").value;
const nameInput = document.getElementById("name");

if (nameInput.value.trim() === "") {
    displayErrorMessage("Por favor, preencha o campo Nome.");
    return false; // Prevent form submission
}

if (selectedType === "by-keywords") {
    const listNameInput = document.getElementById("listName");
    const listSlugInput = document.getElementById("listSlug");
    const dynamicKeywordGroups = document.querySelectorAll("#groupSession [name='keywords']");

    if (listNameInput.value.trim() === "" || listSlugInput.value.trim() === "") {
        displayErrorMessage("Por favor, preencha os campos obrigatórios para Palavras-Chave.");
        return false; // Prevent form submission
    }

    // Validate slug format
    if (!/^[a-z]+(-[a-z]+)?$/.test(listSlugInput.value.trim())) {
        displayErrorMessage("O slug deve conter apenas uma palavra, caso seja palavras compostas, separe com '-' , as letras devem ser minúsculas, e não deve conter o caractere '.'.");
        return false; // Prevent form submission
    }

    // Validate keyword groups
    for (const keywordInput of dynamicKeywordGroups) {
        const keywordsValue = keywordInput.value.trim();
        if (keywordsValue === "" || keywordsValue.includes(".")) {
            displayErrorMessage("Por favor, preencha todos os campos de palavras-chave separado por ',' ");
            return false; // Prevent form submission
        }
    }
}

// Clear previous error message
clearErrorMessage();

// You can add additional validation if needed

return true; // Allow form submission
}

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(clearErrorMessage, 5000);
}

function clearErrorMessage() {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent = "";
    errorMessageElement.style.display = "none";
}

function redirectToAnotherPage() {
    var cardPrincipal = document.querySelector('.card-principal');
    if (!cardPrincipal.classList.contains('disabled')) {
        window.location.href = "/analytic/add";
    }
}