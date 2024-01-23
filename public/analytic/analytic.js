var cardsCounter = 3; // Inicializa o contador

    function addCard() {
    if (cardsCounter > 0) {
        var newCard = document.createElement("div");
        newCard.className = "new-card";  // Assign a different class for new cards
        newCard.innerHTML = "Novo Analytic";
        document.getElementById("cards-container").appendChild(newCard);
        cardsCounter--;

        updateButtonVisibility();
        }
    }

    function updateButtonVisibility() {
        // Atualiza a visibilidade do botão com base no contador
        var button = document.getElementById("addCardBtn");
       // var counterSpan = document.getElementById("cardsCounter");

       // counterSpan.textContent = cardsCounter;

        if (cardsCounter === 0) {
            button.classList.add("disabled", "card-disabled");
            button.setAttribute("disabled", "true");

        }
    }


    