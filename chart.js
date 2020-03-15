// chart.canvas.width = "500";
// chart.canvas.height = "300";
//
// var c_w = chart.canvas.width;
// var c_h = chart.canvas.height;

let myChart = document.getElementById("myChart");

// Chart.defaults.global.elements.point.radius = 1;
// Chart.defaults.global.elements.line.fill = false;

myChart = new Chart(myChart, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '# of Concurrently Sick People',
            data: [],
            backgroundColor: [],
            pointBorderColor: [],
            borderWidth: 1,
            fill: false,
            pointRadius: 1,
            pointHoverRadius: 5,
            borderColor: 'none',
            showLine: false
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
})

class SickChart {
    constructor(turns, population) {
        this.turns = turns;
        this.population = population;
        this.sick = [[]];
        this.currentColor = "#FF0000";
        myChart.data.labels = new Array(turns);
        for (let i = 0; i < turns; i++) {
            myChart.data.labels[i] = i;
        }
        myChart.options.scales.yAxes[0].ticks.max = population;
        myChart.update();
    }

    reset() {
        this.sick = [[]];
    }

    updateChart(sickCount, turn) {
        if (turn === 0) {
            this.currentColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        }
        myChart.data.datasets[0].data.push({
            x: turn,
            y: sickCount
        });
        myChart.data.datasets[0].backgroundColor.push(this.currentColor);
        myChart.data.datasets[0].pointBorderColor.push(this.currentColor);
        myChart.update();
    }
}
