(function(win, doc) {

    var numbers = [];
    var cartTotalValue = 0;
    var game;

    var completeGameButton = doc.querySelector('[data-js="complete-game-button"]');
    completeGameButton.addEventListener('click', completeGame, false);

    var clearGameButton = doc.querySelector('[data-js="clear-game-button"]');
    clearGameButton.addEventListener('click', clearGame, false);
    
    var addGameButton = doc.querySelector('[data-js="add-game-button"]');
    addGameButton.addEventListener('click', addGameToCart, false);

    function loadGames() {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', 'games.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', ajaxGamesEvent, false);
    }
    function ajaxGamesEvent() {
        if(this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            buildGames(response.types);
        }
    }
    function buildGames(types) {
        console.log(types);
        var buttonsContainer = doc.querySelector('[data-js="games-buttons"]');
        var clickFirstGame = false;
        types.forEach((game) => {
            var button = doc.createElement('button');
            button.innerText = game.type;
            button.dataset.js = 'game-button';
            button.classList = 'game-button';
            button.style.borderColor = game.color;
            button.style.color = game.color;
            button.addEventListener('click', () => gameChange(button, game), false);
            buttonsContainer.appendChild(button);
            if(!clickFirstGame) {
                button.click();
                clickFirstGame = true;
            }
        })
    }
    function gameChange(button, gameChoosed) {
        game = gameChoosed;
        numbers = [];

        var gameName = doc.querySelector('[data-js="game-name"]');
        gameName.innerText = game.type.toUpperCase();

        var gameButtons = doc.querySelectorAll('[data-js="game-button"]');
        gameButtons.forEach((item) => {
            item.style.color = item.style.borderColor;
            item.style.backgroundColor = '#FFFFFF';
        })

        button.style.backgroundColor = game.color;
        button.style.color = '#FFFFFF';

        var gameDescription = doc.querySelector('[data-js="game-description"]');
        gameDescription.innerText = game.description;
        var board = doc.querySelector('[data-js="board"]');
        board.innerHTML = '';
        var boardButtons = []
        for(let i = 0; i < game.range; i++) {
            boardButtons.push(doc.createElement('button'));
            boardButtons[i].innerText = i+1;
            boardButtons[i].classList = 'board-button';
            boardButtons[i].dataset.js = 'board-button-' + (i+1);
            boardButtons[i].addEventListener('click', () => boardButtonClick(boardButtons[i], i), false);
            board.appendChild(boardButtons[i]);
        }
    }

    function boardButtonClick(button, index) {

        var buttonPressed = index + 1;

        if(numbers.indexOf(buttonPressed) === -1) {
            if(numbers.length === game['max-number']) {
                alert('O máximo de numeros para esse jogo foi atingido')
            } else {
                button.style.backgroundColor = game.color;
                numbers.push(buttonPressed);
            }
        } else {
            button.style.backgroundColor = '#ADC0C4';
            numbers.splice(numbers.indexOf(buttonPressed), 1);
        }

    }

    function completeGame() {
        var numbersToComplete = game['max-number'] - numbers.length;

        for(let i = 0; i < numbersToComplete; i++) {
            var randomNumber = Math.floor((Math.random() * game.range) + 1)
            if(numbers.indexOf(randomNumber) === -1) {

                var buttonToPress = doc.querySelector(`[data-js="board-button-${randomNumber}"]`);
                boardButtonClick(buttonToPress, randomNumber-1);

            } else {
                i--;
            }
        }        
    }

    function clearGame() {
    
        numbers.forEach((number) => {
            var buttonToPress = doc.querySelector(`[data-js="board-button-${number}"]`)
            buttonToPress.style.backgroundColor = '#ADC0C4';
        })

        numbers = [];

    }

    function addGameToCart() {
        if(numbers.length !== game['max-number']) {
            alert(`Para fazer esse jogo você precisa selecionar ${game['max-number']} números.`);
        } else {
            var item = doc.createElement('div');
            item.classList = 'item';

            var trashCan = doc.createElement('img');
            trashCan.alt = 'trash-icon';
            trashCan.src = 'assets/icons/trash.svg';
            trashCan.addEventListener('click', () => removeGame(item), false);

            var bar = doc.createElement('bar');
            bar.classList = 'bar';

            var itemInfos = doc.createElement('div');
            itemInfos.classList = 'item-infos';

            var pNumbers = doc.createElement('p');
            pNumbers.classList = 'item-numbers';
            pNumbers.innerText = numbers.map((number, index, array) => {
                var response = '';
                if(index !== 0) {
                    response += ' ';
                }
                if(number <= 9) {
                    response += '0';
                }
                response += '' + number;
                if(index+1 === array.length) {
                    response += '.';
                }
                return response;
            });

            var itemGame = doc.createElement('div');
            itemGame.classList = 'item-game';

            var itemGameName = doc.createElement('p');
            itemGameName.classList = 'item-game-name';
            itemGameName.innerText = game.type;
            itemGameName.style.color = game.color;

            var itemGameValue = doc.createElement('p');
            itemGameValue.classList = 'item-game-value';
            const reg = /\./g;
            var brl = new Intl.NumberFormat("pt-BR", {
                style: 'currency',
                currency: 'BRL'
            }).format(game.price);
            itemGameValue.innerText = brl;

            itemGame.appendChild(itemGameName);
            itemGame.appendChild(itemGameValue);
            
            itemInfos.appendChild(pNumbers);
            itemInfos.appendChild(itemGame);

            item.appendChild(trashCan);
            item.appendChild(bar);
            item.appendChild(itemInfos);

            var cartItens = doc.querySelector('[data-js="cart-itens"]');
            cartItens.appendChild(item);


            cartTotalValue += game.price;
            var totalValue = new Intl.NumberFormat("pt-BR", {
                style: 'currency',
                currency: 'BRL'
            }).format(cartTotalValue);

            doc.querySelector('[data-js="total-value"]').innerText = totalValue;

            clearGame();

        }

        function removeGame(item) {

            var itemValue = item.lastChild.lastChild.lastChild.innerText.replace(/^\D+/g,'');

            itemValue = itemValue.replace(/,/g, '.');

            cartTotalValue -= Number(itemValue);

            var totalValue = new Intl.NumberFormat("pt-BR", {
                style: 'currency',
                currency: 'BRL'
            }).format(cartTotalValue);

            doc.querySelector('[data-js="total-value"]').innerText = totalValue;


            var cartItens = doc.querySelector('[data-js="cart-itens"]');
            cartItens.removeChild(item);
        }
    }
    loadGames();
})(window, document);