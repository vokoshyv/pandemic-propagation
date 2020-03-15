let populationSlider = document.getElementById("population-slider");
let populationDisplay = document.getElementById("population-display");

populationSlider.oninput = function() {
    populationDisplay.innerHTML = this.value;
}

let sickSlider = document.getElementById("sick-slider");
let sickDisplay = document.getElementById("sick-display");

sickSlider.oninput = function() {
    sickDisplay.innerHTML = this.value;
}

let fpsSlider = document.getElementById("fps-slider");
let fpsDisplay = document.getElementById("fps-display");

fpsSlider.oninput = function() {
    fpsDisplay.innerHTML = this.value;
    FPS = this.value;
    clearInterval(test);
    if (turn < turns) {
        runModel(this.value);
    }
}

let movementSlider = document.getElementById("movement-slider");
let movementDisplay = document.getElementById("movement-display");

movementSlider.oninput = function() {
    movementDisplay.innerHTML = `${this.value}%`;
}

let handwashSlider = document.getElementById("handwash-slider");
let handwashDisplay = document.getElementById("handwash-display");

handwashSlider.oninput = function() {
    handwashDisplay.innerHTML = `${this.value}%`;
}

let turnsSlider = document.getElementById("turns-slider");
let turnsDisplay = document.getElementById("turns-display");

turnsSlider.oninput = function() {
    turnsDisplay.innerHTML = this.value;
}

let runButton = document.getElementById("run");

runButton.onclick = function() {
    clearInterval(test);
    inProgress = true;
    document.getElementById("pause").innerHTML = "Pause";
    POPULATION = populationSlider.value;
    NUMBER_OF_INITIAL_SICK = sickSlider.value;
    INFECTED_HEALTHY_MOVEMENT_PROBABILITY = parseInt(movementSlider.value) / 100;
    HANDWASH_EFFICACY = parseInt(handwashSlider.value) / 100;
    myChart.options.scales.yAxes[0].ticks.max = POPULATION;
    turn = 0;
    turns = turnsSlider.value;
    if (POPULATION !== sickChart.population || turns !== sickChart.turns) {
        sickChart = new SickChart(turns, 2 * POPULATION / 5);
    }
    createPopulation();
    runModel(FPS, turn, turns);
};

let pauseButton = document.getElementById("pause");

pauseButton.onclick = function() {
    inProgress = (inProgress) ? false : true;
    pauseButton.innerHTML = (pauseButton.innerHTML === "Pause") ? "Continue" : "Pause";
};

let runAndResetButton = document.getElementById("run-reset");

runAndResetButton.onclick = function() {
    clearInterval(test);
    inProgress = true;
    document.getElementById("pause").innerHTML = "Pause";
    POPULATION = populationSlider.value;
    NUMBER_OF_INITIAL_SICK = sickSlider.value;
    INFECTED_HEALTHY_MOVEMENT_PROBABILITY = parseInt(movementSlider.value) / 100;
    HANDWASH_EFFICACY = parseInt(handwashSlider.value) / 100;
    myChart.data.datasets[0].data = [];;
    myChart.data.datasets[0].backgroundColor = [];;
    myChart.data.datasets[0].pointBorderColor = [];;
    myChart.options.scales.yAxes[0].ticks.max = POPULATION;
    turn = 0;
    turns = turnsSlider.value;
    if (POPULATION !== sickChart.population || turns !== sickChart.turns) {
        sickChart = new SickChart(turns, 2 * POPULATION / 5);
    }
    createPopulation();
    runModel(FPS, turn, turns);
};
