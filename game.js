const fieldSize = 4;
const colors = {
    2: 'rgb(221, 217, 201);',
    4: 'rgb(187, 180, 152);',
    8: 'rgb(156, 147, 110);',
    16: 'rgb(136, 125, 81);',
    32: 'rgb(100, 88, 40);',
    64: 'rgb(71, 61, 18);',
    128: 'rgb(63, 53, 9);',
    256: 'rgb(14, 79, 122);',
    512: 'rgb(16, 109, 172);',
    1024: 'rgb(32, 135, 204);',
    2048: 'rgb(0, 153, 255);'
};

let cells;
let htmlElements;


function initGame() {
    generateTable();
    createCells();
    fillTwoRandomEmptyCells();
    drawCells();
    initializeEvent();
}

function generateTable() {

    if(htmlElements) {
        return;
    }

    htmlElements = [];
    let body = document.getElementsByTagName('body')[0];
    let table = document.createElement('table');
    table.setAttribute('id', 'gameField');

    for(let i=0; i < fieldSize; i++) {
        let tr = document.createElement('tr');
        let trArr = [];
        for(let j=0; j < fieldSize; j++) {
            let td = document.createElement('td');
            td.setAttribute('class', 'cell');
            td.appendChild(document.createTextNode(0));
            tr.appendChild(td);
            trArr.push(td);
        }
        table.appendChild(tr);
        htmlElements.push(trArr);
    }
    body.appendChild(table);
}

function createCells() {
    cells = [];
    for(let i=0; i < fieldSize; i++) {
        cells[i] = new Array(fieldSize);
        for(let j=0; j < cells[i].length; j++) {
            cells[i][j] = 0;
        }
    }
}

function isArrayFull(array) {
    for(let i=0; i < fieldSize; i++) {
        for(let j=0; j < fieldSize; j++) {
            if(array[i][j] == 0) {return false;}
        }
    }
    return true;
}


function isPossibleNumberMerge(array) {
    for(let i=0; i < fieldSize; i++) {
        
        for(let j=0; j < fieldSize; j++) {
            c = array[i][j]
            if(i != fieldSize -1 && c == array[i + 1][j] || j != fieldSize -1 && c == array[i][j + 1]) { return true; }
            if(i != 0 && c == array[i - 1][j] || j != 0 && c == array[i][j - 1]) { return true; }
        }
    }
    return false;
}


function isGameOver(array) {
    if(isArrayFull(array) && !isPossibleNumberMerge(array)) {
        alert("You lost! Press ok to start new game"); 
        return true;
    }
    if(hasPlayerWon(array)) {
        alert("You won! Press ok to start new game"); 
        return true;
    }
    return false;
}

function hasPlayerWon(array) {
    for(let i=0; i < fieldSize; i++) {
        for(let j=0; j < fieldSize; j++) {
            if(array[i][j] == 2048) {return true;}
        }
    }
    return false;
}

function fillTwoRandomEmptyCells() {
    let numbers = 0;
    while(numbers < 2) {
        if(isArrayFull(cells)) {
            break;
        }
        let x, y;
        x = Math.floor(Math.random() * fieldSize);
        y = Math.floor(Math.random() * fieldSize);

        if(cells[x][y] == 0) {
            cells[x][y] = Math.random() <= 0.1 ? 4 : 2;
            numbers++;
        }
    }
}

function drawCells() {
    for(let i=0; i < fieldSize; i++) {
        for(let j=0; j < fieldSize; j++) {
            td = htmlElements[j][i];
            td.innerHTML = cells[j][i] == 0 ? '' : cells[j][i];
            color = 'background-color: ' + colors[cells[j][i]];
            td.setAttribute('style', color);
        }
    }
}

function filterEmptyCells(array) {
    return array.filter(x => x != 0);
}

function mergeCells(row) {
    row = filterEmptyCells(row);
    for(let i = 0; i < row.length; i++){
        if(row[i]==row[i+1]) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    row = filterEmptyCells(row);

    while(row.length < fieldSize) {
        row.push(0);
    }
    return row
}

function rotateCellsToLeft(rotates) {
    while(rotates > 0) {
        resultArray = [];
        for(let i=0; i < fieldSize; i++) {
            resultArray[i] = new Array(fieldSize);
        }

        let y = 0;

        for(let i=0; i < fieldSize; i++) {
            x = fieldSize - 1;
            for(let j=0; j < fieldSize; j++) {
                resultArray[i][j] = cells[x][y];
                x--;
            }
            y++;
        }
        cells = resultArray;
        rotates--;
    }
}

function moveLeft() {
    for(let i = 0; i < cells.length; i++) {
        cells[i] = mergeCells(cells[i]);
    }
}

function moveUp() {
    rotateCellsToLeft(3)
    
    for(let i = 0; i < cells.length; i++) {
        cells[i] = mergeCells(cells[i]);
    }
    rotateCellsToLeft(1)
}

function moveDown() {
    rotateCellsToLeft(1)
    for(let i = 0; i < cells.length; i++) {
        cells[i] = mergeCells(cells[i]);
    }
    rotateCellsToLeft(3)
}

function moveRight() {
    rotateCellsToLeft(2)
   
    for(let i = 0; i < cells.length; i++) {
        cells[i] = mergeCells(cells[i]);
    }
    rotateCellsToLeft(2)
}


function initializeEvent() {
    document.addEventListener('keydown', (e) => {
        let key = e.key;

        switch(key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight()
                break;
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
            default:
                return;
        }

        fillTwoRandomEmptyCells();
        drawCells();

        if(isGameOver(cells)) {
            initGame()
        }
    })
}

initGame();
