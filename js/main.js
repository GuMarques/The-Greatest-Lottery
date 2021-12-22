(function(win, doc) {
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
    function gameChange(button, game) {

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
            boardButtons[i].addEventListener('click', () => boardButtonClick(game, boardButtons[i]), false);
            board.appendChild(boardButtons[i]);
        }
    }

    function boardButtonClick(game, button) {
        button.style.backgroundColor = game.color;
        console.log(game, button);
    }
    loadGames();
})(window, document);