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

    this.multiple = 1;
    this.m_max_x = 5 + 1;
    this.m_plot_gap = 1

    this.m_max_y_default = 0.10/110*100
    this.m_max_y = this.m_max_y_default; //*1000 is to convert V to mV;
    this.m_interval = 1000/this.multiple; // 1 second

    this.m_data_chart;
    this.m_data_chart_clone = [];
    this.m_data_chart_clone_gap = [];

    this.m_data_chart_global_voltage = [];

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
    });

    this.resizeAxis();
  }

  onClick(e, legendItem) {
    var ci = this.m_data_chart;
    var curGraph = this;

    var index = legendItem.datasetIndex;

    if (mainSim.simMode() == "Nernst" & index != 3) { //index 3 is the net voltage
      var checkBoxParticle = mainSim.m_dom.m_sim_controls.checkboxes[index].elt.innerText;

      mainSim.m_dom.m_sim_controls.checkbox(index, true);
      curGraph.hidePlot(index, false);
      enableInputForParticle(checkBoxParticle);

      if (mainSim.m_pause) { //If the plot is paused, change the plot particle
        var particleType = mainSim.m_particle_types[index];
        var voltage = mainSim.m_nernst_eq.compute(particleType);
        var dataset = ci.data.datasets[index].data;
        ci.data.datasets[index].data = dataset;
      }

      ci.data.datasets.forEach(function(e, i) {
        if (i !== index && i != 3) {
          var checkBoxParticle = mainSim.m_dom.m_sim_controls.checkboxes[i].elt.innerText;

          mainSim.m_dom.m_sim_controls.checkbox(i, false);
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
          var voltage = mainSim.m_nernst_eq.compute(particleType);
        } else if (i == 3) { // the net voltage
          var voltage = mainSim.m_goldman_eq.compute();
        }

        this.updateData(i, this.m_time, voltage*1000); //*1000 is to convert V to mV
      }

      this.m_time=this.m_time+1/this.multiple;

      if (this.m_time > this.m_max_x - 1) {
        this.m_time = 0;
      }

    }
  }

  hidePlot(legendIndex, value) {
    this.m_data_chart.getDatasetMeta(legendIndex).hidden = value;
  }

  updateData(index, x, y) {
    // Input: chartjs object, int, int, int, int
   var dataset = this.m_data_chart.data.datasets[index].data;

         //Copy the complete plot from clone

    var newData = {
      x: x,
      y: y
    }

        // console.log(dataset)

    if(!this.m_data_chart_global_voltage[index])
    this.m_data_chart_global_voltage[index] = [];

    if(!this.m_data_chart_clone_gap[index])
    this.m_data_chart_clone_gap[index] = 0

    this.m_data_chart_global_voltage[index][x*this.multiple] = y

    dataset[x*this.multiple] = newData

    var prevValue;

    var plotLength = this.m_max_x - this.m_plot_gap

    var prevIndex;
              // console.log('plotLength '+(dataset.length-1)/this.multiple+' plotLength '+plotLength)
        if (dataset.length/this.multiple >= plotLength) {

      for (let i = 0;i<this.multiple;i++) {

        var prevIndex = this.m_data_chart_clone_gap[index];

        prevValue = this.m_data_chart_global_voltage[index][prevIndex];

          console.log('x '+x+' prev '+prevIndex)
        this.m_data_chart_global_voltage[index][prevIndex] = NaN

        dataset[prevIndex] = {
          x: prevIndex,
          y: NaN
        }
      }

      this.m_data_chart_clone_gap[index]++
      if(this.m_data_chart_clone_gap[index]>this.m_max_x-1) this.m_data_chart_clone_gap[index]=0

    }
    // if (dataset.length/this.multiple >= this.m_max_x + 1) {
    //   // dataset.pop(); //Remove the last number if the plot is full
    //   // this.m_data_chart_global_voltage[index].pop()
    //
    //   var target = this
    //   dataset.forEach(function(element) {
    //     element.x=element.x + 1/target.multiple
    //   });
    //
    // }

    this.m_data_chart.data.datasets[index].data = dataset;

    var maxVoltage = Math.abs(this.m_data_chart_global_voltage[index].max()/1000) //To mV

      // console.log(maxVoltage)
        //Resize y-axis automatically
        if(this.m_max_y<maxVoltage) {
          this.m_max_y = maxVoltage
          this.resizeAxis();
        } else if(maxVoltage > this.m_max_y_default) {
          this.m_max_y = maxVoltage
          this.resizeAxis();
        } else if(this.m_max_y != this.m_max_y_default) {
          this.m_max_y=this.m_max_y_default
          this.resizeAxis();
        }

        console.log(this.m_data_chart.data.datasets[index].data);
    this.m_data_chart.update();

     prevIndex = ((prevIndex)>0) ? prevIndex-1 : 0

    console.log(prevIndex)
    dataset[prevIndex] = {
      x: prevIndex,
      y: prevValue
    }
        this.m_data_chart.data.datasets[index].data = dataset;

  }

  resizeAxis() {
    //Resize y-axis automatically
    this.m_data_chart.options = {
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
              min: -this.m_max_y*1100,
              stepSize: (2*1100 * this.m_max_y)/6,
              max: this.m_max_y*1100
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
      animation: false,
      responsive: true,
      maintainAspectRatio: true
    }


    this.m_data_chart.update();
  }
}
