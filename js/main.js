(function(win, doc) {

    var numbers = [];
    var game;

    var completeGameButton = doc.querySelector('[data-js="complete-game-button"]');
    completeGameButton.addEventListener('click', completeGame, false);

    var clearGameButton = doc.querySelector('[data-js="clear-game-button"]');
    clearGameButton.addEventListener('click', clearGame, false);

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
    loadGames();
})(window, document);