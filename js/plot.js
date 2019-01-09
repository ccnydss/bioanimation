var plotIndex = [0,0,0,0]; //Start everything at time = 0

//Define the chart backgrond color
// https://stackoverflow.com/questions/30464750/chart-js-line-chart-set-background-color
Chart.plugins.register({
  beforeDraw: function(chartInstance) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});

var maxX = 31;
var maxY = 0.10*1000; //*1000 is to convert V to mV
setTimeout(
  function() {
    var ctx = document.getElementById('dataPlot').getContext('2d');

    dataChart = new Chart (ctx, {
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
                max: maxX-1
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
                min: -maxY,
                stepSize: 2*maxY/6,
                max: maxY
              },
              scaleLabel: {
                display: true,
                labelString: 'mV'
              }
            }
          ]
        },
        legend: {
          onClick: function(e, legendItem) {
            var ci = this.chart;
            var index = legendItem.datasetIndex;

            if (simulatorMode == "Nernst" & index!=3) { //index 3 is the net voltage
              var checkBoxParticle = document.getElementById('checkbox' + particleTypes[index]).innerText;

              checkboxes[index].checked(true)
              dataChart.getDatasetMeta(index).hidden = false;
              enableInputForParticle(checkBoxParticle);

              ci.data.datasets.forEach(function(e, i) {
                if (i !== index & i !=3) {
                  var checkBoxParticle = document.getElementById('checkbox' + particleTypes[i]).innerText;

                  checkboxes[i].checked(false)
                  dataChart.getDatasetMeta(i).hidden = true;
                  disableInputForParticle(checkBoxParticle);
                }
              })
            }
          }
        },
        animation: false
      }
    });
  },
  1000);


  setInterval(
    function() {
      if(!mainSim.m_pause) { //If the plot is not paused
        for (i = 0; i < 4; i++) {
          if (i < 3) {
            var particleType = particleTypes[i];
            var voltage = calculateNernst(particleType);
          } else if (i==3) {
            var voltage = calculateGoldman();
          }

          updateData(dataChart, 0, i, plotIndex[i], voltage*1000); //*1000 is to convert V to mV

          plotIndex[i]++;
          if (plotIndex[i] >= maxX) {
            plotIndex[i] = maxX;
          }
        }
      }
    },
    1000
  )

  function updateData(chart, label, plotIndex, x, y) {
    // Input: chartjs object, int, int, int, int
    var dataset = chart.data.datasets[plotIndex].data;

    newData = {
      x: x,
      y: y
    }

    // console.log(dataset)
    dataset.push(newData);
    if (dataset.length >= maxX + 1) {
      dataset.shift(); //Remove the first number if the plot is full
      dataset.forEach(function(element) {
        element.x--
      });
    }

    chart.data.datasets[plotIndex].data = dataset;
    chart.update();
  }
