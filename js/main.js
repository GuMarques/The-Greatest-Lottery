(function(_, doc) {

    let numbers = [];
    let cartTotalValue = 0;
    let game;

    const completeGameButton = doc.querySelector('[data-js="complete-game-button"]');
    completeGameButton.addEventListener('click', completeGame, false);

    const clearGameButton = doc.querySelector('[data-js="clear-game-button"]');
    clearGameButton.addEventListener('click', clearGame, false);
    
    const addGameButton = doc.querySelector('[data-js="add-game-button"]');
    addGameButton.addEventListener('click', addGameToCart, false);

    function loadGames() {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', 'games.json', true);
        ajax.send();
        ajax.addEventListener('readystatechange', ajaxGamesEvent, false);
    }
    function ajaxGamesEvent() {
        if(this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            buildGames(response.types);
        }
    }
    function buildGames(types) {
        let buttonsContainer = doc.querySelector('[data-js="games-buttons"]');
        let clickFirstGame = false;
        types.forEach((game) => {
            let button = doc.createElement('button');
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

        const gameName = doc.querySelector('[data-js="game-name"]');
        gameName.innerText = game.type.toUpperCase();

        const gameButtons = doc.querySelectorAll('[data-js="game-button"]');
        gameButtons.forEach((item) => {
            item.style.color = item.style.borderColor;
            item.style.backgroundColor = '#FFFFFF';
        })

        button.style.backgroundColor = game.color;
        button.style.color = '#FFFFFF';

        const gameDescription = doc.querySelector('[data-js="game-description"]');
        gameDescription.innerText = game.description;
        const board = doc.querySelector('[data-js="board"]');
        board.innerHTML = '';
        let boardButtons = []
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

        let buttonPressed = index + 1;

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
        let numbersToComplete = game['max-number'] - numbers.length;

        for(let i = 0; i < numbersToComplete; i++) {
            let randomNumber = Math.floor((Math.random() * game.range) + 1)
            if(numbers.indexOf(randomNumber) === -1) {

                const buttonToPress = doc.querySelector(`[data-js="board-button-${randomNumber}"]`);
                boardButtonClick(buttonToPress, randomNumber-1);

            } else {
                i--;
            }
        }        
    }

    function clearGame() {
    
        numbers.forEach((number) => {
            const buttonToPress = doc.querySelector(`[data-js="board-button-${number}"]`)
            buttonToPress.style.backgroundColor = '#ADC0C4';
        })

        numbers = [];

    }

    function addGameToCart() {
        if(numbers.length !== game['max-number']) {
            alert(`Para fazer esse jogo você precisa selecionar mais ${(game['max-number'] - numbers.length)} números.`);
        } else {

            numbers.sort(function(a, b) {
                return a - b;
            })

            if( checkIfGameAlreadyDone(numbers) ) {
                alert('Você já realizou um jogo com esses números');
            } else {

                if(doc.querySelector('[data-js="empty-cart"]')) {
                    let emptycart = doc.querySelector('[data-js="empty-cart"]');
                    let cartItens = doc.querySelector('[data-js="cart-itens"]');
                    cartItens.removeChild(emptycart);
                }

                let item = doc.createElement('div');
                item.classList = 'item';

                let trashCan = doc.createElement('img');
                trashCan.alt = 'trash-icon';
                trashCan.src = 'assets/icons/trash.svg';
                trashCan.addEventListener('click', () => removeGame(item), false);

                let bar = doc.createElement('bar');
                bar.classList = 'bar';
                bar.style.backgroundColor = game.color;
                /* if (game['max-number'] > 9) {
                    bar.style.width = '8px';
                } */

                let itemInfos = doc.createElement('div');
                itemInfos.classList = 'item-infos';

                let pNumbers = doc.createElement('p');
                pNumbers.classList = 'item-numbers';
                pNumbers.dataset.js= 'item-numbers';

                pNumbers.innerText = numbers.map((number, index, array) => {
                    let response = '';
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

                let itemGame = doc.createElement('div');
                itemGame.classList = 'item-game';

                let itemGameName = doc.createElement('p');
                itemGameName.classList = 'item-game-name';
                itemGameName.dataset.js = 'item-game-name';
                itemGameName.innerText = game.type;
                itemGameName.style.color = game.color;

                let itemGameValue = doc.createElement('p');
                itemGameValue.classList = 'item-game-value';
                let brl = new Intl.NumberFormat("pt-BR", {
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

                let cartItens = doc.querySelector('[data-js="cart-itens"]');
                cartItens.appendChild(item);


                cartTotalValue += game.price;
                let totalValue = new Intl.NumberFormat("pt-BR", {
                    style: 'currency',
                    currency: 'BRL'
                }).format(cartTotalValue);

                doc.querySelector('[data-js="total-value"]').innerText = totalValue;

                clearGame();
            }

        }

        function removeGame(item) {

            let itemValue = item.lastChild.lastChild.lastChild.innerText.replace(/^\D+/g,'');

            itemValue = itemValue.replace(/,/g, '.');

            cartTotalValue -= Number(itemValue);

            let totalValue = new Intl.NumberFormat("pt-BR", {
                style: 'currency',
                currency: 'BRL'
            }).format(cartTotalValue);

            doc.querySelector('[data-js="total-value"]').innerText = totalValue;


            let cartItens = doc.querySelector('[data-js="cart-itens"]');
            cartItens.removeChild(item);

            if(cartItens.childElementCount === 0) {
                let pEmptyCart = doc.createElement('p');
                pEmptyCart.classList = 'empty-cart';
                pEmptyCart.dataset.js = 'empty-cart';
                pEmptyCart.innerText = 'Carrinho vazio, faça um jogo para adiciona-lo aqui.';
                cartItens.appendChild(pEmptyCart);
            }

        }

        function checkIfGameAlreadyDone(numbersGame) {
            let allGames = doc.querySelectorAll('[data-js="item-numbers"]');
            let allGamesName = doc.querySelectorAll('[data-js="item-game-name"]')
            let response = false;
            allGames.forEach((item, index) => {
                let nGameNumbers = item.innerText.replace('.', '');
                nGameNumbers = nGameNumbers.split(',').map(function(num) {
                    return parseInt(num, 10);
                })

                let equals = numbersGame.every((val, index) => 
                    val === nGameNumbers[index]
                );

                if(equals) {
                    if(allGamesName[index].innerText === game.type) {
                        response = true;
                    }
                };
            });
            return response;
        }
    }
    loadGames();
})(window, document);