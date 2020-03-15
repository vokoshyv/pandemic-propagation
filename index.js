const canvas = document.getElementById("canvas");

const CELL_WIDTH = 5;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
let turns = 300;
let POPULATION = 1000;
let NUMBER_OF_INITIAL_SICK = 4;
let INFECTED_HEALTHY_MOVEMENT_PROBABILITY = 1.0;
let HANDWASH_EFFICACY = 0.0;
let FPS = 24;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

var ctx = canvas.getContext("2d");

var grid = getMatrix()

let counts = {
    healthy: 0,
    infected: 0,
    sick: 0,
    dead: 0,
    immune: 0
};

function countsReset() {
    counts = {
        healthy: 0,
        infected: 0,
        sick: 0,
        dead: 0,
        immune: 0
    };
}

function countPeople(col) {
    if (col === 29) {
        counts['healthy']++;
    } else if (col === 1) {
        counts['dead']++;
    } else if (col === 2) {
        counts['immune']++;
    } else if (col >= 24 && col <= 28) {
        counts['infected']++;
    } else if (col >= 3 && col <= 23) {
        counts['sick']++;
    }
}


function getMatrix() {
    let matrix = [];
    for (let i = 0; i < CANVAS_HEIGHT; i += CELL_WIDTH) {
        matrix.push([]);
        for (let j = 0; j < CANVAS_WIDTH; j += CELL_WIDTH) {
            matrix[matrix.length - 1].push(0);
        }
    }
    return matrix;
}

function draw (grid) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let y = 0
    countsReset();
    for (let row of grid) {
        let x = 0
        for (let col of row) {
            ctx.beginPath()
            ctx.lineWidth = 0.1;
            ctx.rect(x, y, CELL_WIDTH, CELL_WIDTH);
            if (col === 2) {
                // immune - green
                ctx.fillStyle = '#32CD32';
                ctx.fill();
                countPeople(col);
            }
            if (col === 1) {
                // dead - grey
                ctx.fillStyle = '#696969';
                ctx.fill();
                countPeople(col);
            }
            if (col >= 3 && col <= 18) {
                // sick - red
                ctx.fillStyle = '#FF0000';
                ctx.fill();
                countPeople(col);
            }
            if (col >= 24 && col <= 28) {
                // infected - yellow
                ctx.fillStyle = '#ff9900';
                ctx.fill();
                countPeople(col);
            }
            if (col === 29) {
                // healthy - blue
                ctx.fillStyle = '#24A0ED';
                ctx.fill();
                countPeople(col);
            }
            ctx.stroke();
            x += CELL_WIDTH
        }
        y += CELL_WIDTH
    }
}

function createPopulation() {
    // create an array that represents all of the individuals
    // in a population
    let cells = new Array(grid.length * grid[0].length).fill(0);
    for (let i = 0; i < POPULATION; i++) {
        cells[i] = 29;
    }

    for (let i = 0; i < NUMBER_OF_INITIAL_SICK; i++) {
        cells[i] = 18;
    }

    // shuffle cells
    let i = cells.length;
    while (i--) {
        let swapIndex = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[swapIndex]] = [cells[swapIndex], cells[i]];
    }

    // fill in results of cells on grid
    let index = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            grid[y][x] = cells[index];
            index++;
        }
    }
}

function moveIndividual(x, y, grid) {
    if (grid[y][x] === 0) {
        return x + '_' + y;
    }

    // pick one of eight possible directions
    let directions = [
        "north",
        "northeast",
        "east",
        "southeast",
        "south",
        "southwest",
        "west",
        "northwest"
    ]

    let direction = directions[Math.floor(Math.random() * 8)];

    let coordinateChanges = {
        "north": [0,-1],
        "northeast": [1,-1],
        "east": [1,0],
        "southeast": [1,1],
        "south": [0,1],
        "southwest": [-1,1],
        "west": [-1,0],
        "northwest": [-1,-1]
    }

    let coorChange = coordinateChanges[direction];

    let newX = x + coorChange[0];
    let newY = y + coorChange[1];

    // first check if coordinate if off of the grid
    if (newX < 0 || newY < 0 || newX >= grid[0].length || newY >= grid.length) {
        // if so, no movement occurs
        return x + '_' + y;
    }
    // now check if that spot is already taken
    if (grid[newY][newX] !== 0) {
        // if so, no movement occurs
        return x + '_' + y;
    }

    // if we reach this point, movement occurs
    // toggle accordingly
    grid[newY][newX] = grid[y][x];
    grid[y][x] = 0;
    return newX + '_' + newY;
}

function movement() {
    let alreadyMoved = new Set();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (!alreadyMoved.has(x + '_' + y)) {
                // sick people stop moving
                if ((grid[y][x] >= 24 && grid[y][x] <= 29) || grid[y][x] == 2) {
                    if (Math.random() < INFECTED_HEALTHY_MOVEMENT_PROBABILITY) {
                        // Even healthy people are moving less
                        let newCoor = moveIndividual(x, y, grid);
                        alreadyMoved.add(newCoor);
                    }
                }
            }
        }
    }
}

function getsSick(x, y, grid) {
    let queue = [];
    queue.push([[x, y], 0]);
    let currX, currY, steps;
    let visited = new Set();
    visited.add(x + '_' + y);

    while (queue.length > 0) {
        [[currX, currY], steps] = queue.shift();

        if (grid[currY][currX] >= 3 && grid[currY][currX] <= 28) {
            let prob;
            if (steps === 1) {
                prob = 0.8;
                if (Math.random() < prob) {
                    grid[y][x] = 28;
                    return;
                }
            } else if (steps === 2) {
                prob = 0.5;
                if (Math.random() < prob) {
                    grid[y][x] = 28;
                    return;
                }
            } else if (steps === 3) {
                prob = 0.25;
                if (Math.random() < prob) {
                    grid[y][x] = 28;
                    return;
                }
            }
        }

        if (steps === 3) {
            continue;
        }
        let north = [[currX, currY - 1], steps + 1];
        let northeast = [[currX + 1, currY - 1], steps + 1];
        let east = [[currX + 1, currY], steps + 1];
        let southeast = [[currX + 1, currY+1], steps + 1];
        let south = [[currX, currY+1], steps + 1];
        let southwest = [[currX-1, currY+1], steps + 1];
        let west = [[currX-1, currY], steps + 1];
        let northwest = [[currX-1, currY-1], steps + 1];

        let directions = [north, northeast, east, southeast, south, southwest, west, northwest];

        for (let direction of directions) {
            let key = direction[0][0] + '_' + direction[0][1];
            if (direction[0][0] < 0 || direction[0][1] < 0 || direction[0][0] >= grid[0].length || direction[0][1] >= grid.length) {
                continue;
            }
            if (!visited.has(key)) {
                queue.push(direction);
                visited.add(key);
            }
        }
    }
}

function propagation () {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            // check if gets infected
            if (grid[y][x] === 29) {
                getsSick(x, y, grid);
            }
        }
    }
}

function washHands() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] >=24 && grid[y][x] <= 28) {
                if (Math.random() < HANDWASH_EFFICACY) {
                    grid[y][x] = 29;
                }
            }
        }
    }
}

function illnessProgression() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] >= 3 && grid[y][x] <= 28) {
                if (Math.random() < 0.012665) {
                    // death
                    grid[y][x] = 1;
                } else {
                    grid[y][x] = grid[y][x] - 1;
                }
            }
        }
    }
}







// update turn over time
let turn = 0;
draw(grid);
let progress = document.getElementById("progress-bar-percentage");

// steps prior to running model
let test;
let inProgress = true;
createPopulation();

let sickChart = new SickChart(turns, 2 * POPULATION / 5);

// steps run during each turn
function runModel(FPS, currentTurn, currentTurns) {
    test = setInterval(function() {
        if (inProgress) {
            movement();
            propagation();
            illnessProgression();
            // washHands();
            draw(grid);
            sickChart.updateChart(counts.sick, turn);
            currentTurn = currentTurn ? currentTurn : turn;
            currentTurns = currentTurns ? currentTurns : turns;
            if (currentTurn + 2 > currentTurns) {
                clearInterval(test);
            }

            currentTurn++;
            turn++;
            progress.style.width = (currentTurn / currentTurns * 100).toString() + '%';
            progress.innerHTML = `${currentTurn}/${currentTurns}`;
        }
    }, 1000 / FPS);
}

runModel(FPS, turn, turns);
