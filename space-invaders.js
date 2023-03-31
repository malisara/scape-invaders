"use strict";


const btnChooseLevel = Array.from(document.querySelectorAll('.btn')); 4;
const divChooseLevel = document.getElementById('chooseLevel');
const gameGrid = document.getElementById('grid');
const scoreGrid = document.getElementById('score');

const NUMBER_BLOCKS_ROW = 20;


let allDivsArray = []; //IDs
let aliensArray = []; //IDs
let level = 0;
let score = 0;


btnChooseLevel.forEach(button => {
    button.addEventListener('click', function () {
        level = this.value;
        divChooseLevel.style.display = 'none';
        startNewGame();
    });
});


function startNewGame() {
    resetValues();
    gameGrid.style.display = 'flex';
    scoreGrid.style.display = 'flex';
    scoreGrid.innerHTML = 'Score: ' + score;
    createBaseDivs();
    createAlienArray();
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


function resetValues() {
    allDivsArray = [];
    aliensArray = [];
}