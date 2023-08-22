# Minesweeper

This game is comprised of 5 functions: createGame, floodReveal, flagCell, minesweep, and checkWin

## Create Game
```js
// expects the cell the user first clicks, to prevent the placement of a bomb being there
function createGame([x, y]) {
    const { cells } = this.state;

    // creates a empty square 2d array 
    let _c = [...new Array(cells.length)].map(n => [...new Array(cells.length)]);

    // adds a buffer of no bombs adjacent the selected cell, to prevent a single visible cell at game start
    for (var j = -1; j <= 1; j++)
        for (var k = -1; k <= 1; k++) {
            if ((x + j < 0) || (y + k < 0) || (y + k > _c.length - 1) || (x + j > _c.length - 1)) continue;
            _c[x + j][y + k] = 'no bomb';
        }

    let c2 = _c.length * _c.length;
    // create how many bombs there are going to be based on a random difficulty inbetween 10 - 20% bombs
    let nbombs = Math.round(Math.random() * 0.1 * c2 + 0.1 * c2);
    // original minesweeper game bomb percents: 
    // easy - 12%, medium - 12.5%, hard - 13%

    // poplate tuhat many bombs ignoring the no bombs
    for (var b = 0; b < nbombs; b) {
        let [_x, _y] = [0, 0].map(a => Math.floor(_c.length * Math.random()));
        if (!_c[_x][_y]) {
            _c[_x][_y] = -1;
            b++;
        }
    }

    // gets the count of how many bombs there are in proximity, if it is a bomb it returns -1
    function getProximity(x, y, cells) {
        if (cells[x][y] === -1) return -1;
        let count = 0;
        for (var j = -1; j <= 1; j++) {
            for (var k = -1; k <= 1; k++) {
                if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1) || (!j && !k)) continue;
                count -= parseInt(cells[x + j][y + k]) || 0;
            }
        }
        return count;
    }

    // for each cell populate the default information and get its bombs in proximity
    _c = _c.map((row, x) => row.map((b, y) => ({
        proximity: getProximity(x, y, _c),
        revealed: false,
        flagged: false,
        img: Math.floor(projectData.length * Math.random())
    })))

    // update the state and reveal the first visible area
    this.setState({ 
        cells: this.floodReveal([x, y], _c), 
        gamepaused: false 
    });
}
```

## Flood Reveal
```js
// this function reveals multiple cells at once recursively 
function floodReveal([x, y], cells) {
    var j, k;
    // check to see if this cell meets the correct amount of flags to reveal the other adjacent cells
    if (cells[x][y].revealed && cells[x][y].proximity > 0) {
        var flags = 0;
        for (j = -1; j <= 1; j++)
            for (k = -1; k <= 1; k++) {
                if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
                flags += cells[x + j][y + k].revealed ? 0 : cells[x + j][y + k].flagged;
            }
        // if there are enough flags to meet the cells requirement
        // flood fill again for the cells that dont have flags around them
        if (flags >= cells[x][y].proximity) {
            for (j = -1; j <= 1; j++)
                for (k = -1; k <= 1; k++) {
                    if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
                    cells[x + j][y + k].revealed = !cells[x + j][y + k].flagged;
                    if (!cells[x + j][y + k].proximity)
                        cells = this.floodReveal([x + j, y + k], cells);
                }
        }
        return cells;
    }

    // mark the current cell as revealed
    cells[x][y].revealed = true;

    // check the adjacent cells and if they dont have a proximity attempt to flood fill again
    for (j = -1; j <= 1; j++) {
        for (k = -1; k <= 1; k++) {
            if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
            if (!cells[x][y].proximity) {
                if (cells[x + j][y + k].revealed) continue;
                cells = this.floodReveal([x + j, y + k], cells);
            }
        }
    }

    return cells;
}
```

## Flag Cell
```js
function flagCell(e) {
    e.preventDefault();
    let { cells, gameStatus } = this.state;
    const [x, y] = e.target.id.split(' ');

    // make sure the game is active, the cell has info
    // and prevent the cell from getting flagged if it has already been revealed
    if (!!gameStatus || !cells[x][y] || cells[x][y].revealed) return;

    // toggle the flagged state
    cells[x][y].flagged = !cells[x][y].flagged;
    this.setState({ cells });

    // check win to make sure that the last flag can trigger the win condition
    this.checkWin();
}
```

## Minesweep
```js
function minesweep(id) {
    var [x, y] = id.split(' ').map(i => parseInt(i));
    const { cells, gameStatus } = this.state;
    const c = cells[x][y];

    if (!!gameStatus) return;

    if (c === undefined) { // start the game if the cell is empty
        this.createGame([x, y]); 
    } else if (!c.flagged) { // reveal that cell
        this.setState({ cells: this.floodReveal([x, y], cells) });
        this.checkWin();
    } else { // open the modal if clicking on a flagged cell
        this.modalShow(projectData[c.img].title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_'));
    }
}
```

## Check Win
```js
async function checkWin() {
    await timeout(0); // put this function at the end of the current js stack
    const { cells } = this.state;
    
    // check each cell to make sure they have not revealed a bomb
    // and all other cells are flagged or revealled
    var lost = false, win = 0;
    for (const row of cells) {
        for (const c of row) {
            if (c.proximity < 0 && c.revealed) {
                lost = true; 
                break;
            }
            if ((c.proximity >= 0 && c.revealed) || (c.proximity < 0 && c.flagged)) win++;
            else break; // break early if not enough cells meet the lost or win conditions
        }
    }
    // if all cell meet the win condition, they win should equal the total amount of cells
    win = win === cells.length * cells.length;

    if (win || lost) this.setState({ 
        gameStatus: +win || -1, 
        gamepaused: !!(+win || -1), 
    });
}
```