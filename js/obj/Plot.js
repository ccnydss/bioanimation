//Define the chart backgrond color
// https://stackoverflow.com/questions/30464750/chart-js-line-chart-set-background-color
Chart.plugins.register({
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});

class Plot {
  constructor() {
    this.m_time = 0;
    this.m_max_x = 31;
    this.m_max_y = 0.10*1000; //*1000 is to convert V to mV;
    this.m_interval = 1000; // 1 second

    this.m_data_chart;

    this.initialize();
    setInterval(this.plot.bind(this), this.m_interval);
  }

  initialize() {
    var ctx = document.getElementById('dataPlot').getContext('2d');

    this.m_data_chart = new Chart (ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Na',
            fill: false,
            data: [],
            pointRadius: 0,
            borderColor: Na.color,
            backgroundColor: Na.color,
          },
          {
            label: 'Cl',
            fill: false,
            data: [],
            pointRadius: 0,
            borderColor: Cl.color,
            backgroundColor: Cl.color,
            hidden: true,
          },
          {
            label: 'K',
            fill: false,
            data: [],
            pointRadius: 0,
            borderColor: K.color,
            backgroundColor: K.color,
            hidden: true,
          },
          {
            label: 'Net',
            fill: false,
            data: [],
            pointRadius: 0,
            borderColor: 'gray',
            backgroundColor: 'gray',
            hidden: true,
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: {
                beginAtZero: true,
                steps: 1,
                stepValue: 1,
                max: this.m_max_x - 1
              },
              scaleLabel: {
                display: true,
                labelString: 'sec'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: -this.m_max_y,
                stepSize: 2 * this.m_max_y/6,
                max: this.m_max_y
              },
              scaleLabel: {
                display: true,
                labelString: 'mV'
              }
            }
          ]
        },
        legend: {
          onClick: this.onClick.bind(this)
        },
        animation: false
      }
    });
  }

  onClick(e, legendItem) {

    var ci = this.m_data_chart;
    var curGraph = this;

    var index = legendItem.datasetIndex;

    if (mainSim.simMode() == "Nernst" & index != 3) { //index 3 is the net voltage
      var checkBoxParticle = document.getElementById('checkbox' + mainSim.m_particle_types[index]).innerText;

      mainSim.checkbox(index, true);
      curGraph.hidePlot(index, false);
      // Note grpah is a global variable that define the cur dataChart!!
      enableInputForParticle(checkBoxParticle);

      if (mainSim.m_pause) { //If the plot is paused, change the plot particle
        var particleType = mainSim.m_particle_types[index];
        var voltage = calculateNernst(mainSim.m_particle_types);
        var dataset = ci.data.datasets[index].data;
        ci.data.datasets[index].data = dataset;
      }

      console.log(ci.data.datasets)
      ci.data.datasets.forEach(function(e, i) {
        if (i !== index && i !=3) {
          var checkBoxParticle = document.getElementById('checkbox' + mainSim.m_particle_types[index]).innerText;

          mainSim.checkbox(i, false);
          curGraph.hidePlot(i, true);
          disableInputForParticle(checkBoxParticle);
        }
      })

      ci.update();

    }
  }

  plot() {
    if (!mainSim.m_pause) { //If the plot is not paused
      for (var i = 0; i < 4; i++) {
        if (i < 3) {
          var particleType = mainSim.m_particle_types[i];
          var voltage = calculateNernst(particleType);
        } else if (i == 3) { // the net voltage
          var voltage = calculateGoldman();
        }

        this.updateData(i, this.m_time, voltage*1000); //*1000 is to convert V to mV
      }

      this.m_time++;

      if (this.m_time >= this.m_max_x) {
        this.m_time = this.m_max_x;
      }
    }
  }

  hidePlot(legendIndex, value) {
    this.m_data_chart.getDatasetMeta(legendIndex).hidden = value;
  }

  updateData(index, x, y) {
    // Input: chartjs object, int, int, int, int
    var dataset = this.m_data_chart.data.datasets[index].data;

    var newData = {
      x: x,
      y: y
    }

    dataset.push(newData);
    if (dataset.length >= this.m_max_x + 1) {
      dataset.shift(); //Remove the first number if the plot is full
      dataset.forEach(function(element) {
        element.x--
      });
    }

    this.m_data_chart.data.datasets[index].data = dataset;
    this.m_data_chart.update();
  }
}
