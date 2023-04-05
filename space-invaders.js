"use strict";


const btnChooseLevel = Array.from(document.querySelectorAll('.btn')); 4;
const divChooseLevel = document.getElementById('chooseLevel');
const gameGrid = document.getElementById('grid');
const scoreGrid = document.getElementById('score');
const endGameDiv = document.getElementById('endGame');

const NUMBER_BLOCKS_ROW = 20;
const NUMBER_ALL_SQUARES = 400;

let allDivsArray = []; //IDs
let aliensArray = []; //IDs
let removedAliens = [];
let direction = 1;
let level = 0;
let score = 0;
let currentUserLocation = 389;
let intervalMoveAliens;

btnChooseLevel.forEach(button => {
    button.addEventListener('click', function () {
        level = this.value;
        divChooseLevel.style.display = 'none';
        startNewGame();
    });
});


function startNewGame() {
    gameGrid.style.display = 'flex';
    scoreGrid.style.display = 'flex';
    scoreGrid.innerHTML = 'Score: ' + score;
    createBaseDivs();
    createAlienArray();
    currentUserLocation = 390;
    allDivsArray[currentUserLocation].classList.add('user'); //Get user
    document.addEventListener('keydown', moveUser);
    intervalMoveAliens = setInterval(moveAliens, 100);
}


function createBaseDivs() {
    for (let i = 0; i < NUMBER_BLOCKS_ROW ** 2; i++) {
        const blankDiv = document.createElement('div');
        blankDiv.setAttribute('id', i);
        allDivsArray.push(blankDiv);
        gameGrid.appendChild(blankDiv);
    }
}


function createAlienArray() {
    const START_ALIEN_POSITION = 5;
    const NUMBER_ALIENS_ROW = 10;

    for (let j = 0; j < level * 2; j++) {
        for (let i = 0; i < NUMBER_ALIENS_ROW; i++) {
            const alienIndex = j * NUMBER_BLOCKS_ROW + (i + START_ALIEN_POSITION);
            aliensArray.push(alienIndex);
        }
    }
    aliensArray.forEach(id => {
        allDivsArray[id].classList.add('alien');
    });
}


function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentUserLocation > NUMBER_ALL_SQUARES - NUMBER_BLOCKS_ROW) {
                deleteUser();
                currentUserLocation -= 1;
                reDrawUser(currentUserLocation);
            }
            break;

        case 'ArrowRight':
            if (currentUserLocation < NUMBER_ALL_SQUARES - 1) {
                deleteUser();
                currentUserLocation += 1;
                reDrawUser(currentUserLocation);
            }
            break;

        case 'ArrowUp':
            shoot();
            break;
    }
}


function deleteUser() {
    allDivsArray.forEach(div => {
        div.classList.remove('user');
    });
}


function reDrawUser(userLocation) {
    allDivsArray[userLocation].classList.add('user');
}


function shoot() {
    let bulletLocation = currentUserLocation - NUMBER_BLOCKS_ROW;
    redrawBullet(bulletLocation);
    let shootingInterval = setInterval(moveBullet, 20);

    function moveBullet() {

        removeBullets();
        if (bulletLocation - NUMBER_BLOCKS_ROW >= 0) {
            bulletLocation -= NUMBER_BLOCKS_ROW;
            redrawBullet(bulletLocation);
            if (allDivsArray[bulletLocation].classList.contains('alien')) {
                score++;
                scoreGrid.innerHTML = 'Score: ' + score;
                removedAliens.push(aliensArray.indexOf(Number(allDivsArray[bulletLocation].id)));
                allDivsArray[bulletLocation].classList.remove('alien');
                clearInterval(shootingInterval);
                removeBullets();

                if (aliensArray.length === removedAliens.length) {
                    youWin();
                }
            }
        }
    }
}


function redrawBullet(bulletLocation) {
    const bullet = allDivsArray[bulletLocation];
    bullet.classList.add('bullet');
}


function removeBullets() {
    allDivsArray.forEach(div => {
        div.classList.remove('bullet');
    });
};


function moveAliens() {
    //TODO works too slow
    let leftEdge = false;
    let rightEdge = false;

    Array.from(document.querySelectorAll('.alien')).map(div => {
        if (div.classList.contains('user') || div.id >= NUMBER_ALL_SQUARES - NUMBER_BLOCKS_ROW) {
            gameOver();
        }

        else {
            if (div.id % NUMBER_BLOCKS_ROW - NUMBER_BLOCKS_ROW + 1 === 0) {
                rightEdge = true;
            }

            if (div.id % NUMBER_BLOCKS_ROW === 0) {
                leftEdge = true;
            }
        }
    });

    deleteAliens();

    if (rightEdge && direction === 1) {
        for (let i = 0; i < aliensArray.length; i++) {
            aliensArray[i] += NUMBER_BLOCKS_ROW + 1;
            direction = -1;
        }
    }

    else if (leftEdge && direction === -1) {
        for (let i = 0; i < aliensArray.length; i++) {
            aliensArray[i] += NUMBER_BLOCKS_ROW - 1;
            direction = 1;
        }
    }

    for (let i in aliensArray) {
        aliensArray[i] += direction;
    }

    reDrawAliens();
}


function deleteAliens() {
    Array.from(document.querySelectorAll('.alien')).forEach(alien => {
        alien.classList.remove('alien');
    });

};


function reDrawAliens() {
    for (let i = 0; i < aliensArray.length; i++) {
        if (!removedAliens.includes(i)) {
            allDivsArray[aliensArray[i]].classList.add('alien');
        }
    }
}


function youWin() {
    endGameBase('Yaay, you win!');
}


function gameOver() {
    endGameBase('You lose!');
}


function endGameBase(text) {
    clearInterval(intervalMoveAliens);
    document.removeEventListener('keydown', moveUser);
    endGameDiv.innerText = text;
    endGameDiv.style.display = 'flex';
    setTimeout(resetValues, 1000);
}


function resetValues() {
    allDivsArray = [];
    aliensArray = [];
    removedAliens = [];
    score = 0;
    deleteUser();
    gameGrid.innerHTML = '';
    gameGrid.style.display = 'none';
    endGameDiv.style.display = 'none';
    divChooseLevel.style.display = 'flex';
    scoreGrid.style.display = 'none';
    document.removeEventListener('keydown', moveUser);
}