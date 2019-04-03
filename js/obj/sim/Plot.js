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
  /**
  Voltage plot.
  * @example <caption>Create an new voltage plot.</caption>
  graph = new Plot(mainSim);
  // hide Na
  graph.hidePlot(0, true);
  // Unhide Na
  graph.hidePlot(0, false);
  *
  * @param {Object} dom - Current simulator DOM object
  * @access public
  */
  constructor(_sim) {
    this.sim = _sim;

    /** @property {Int} - The initial time (x axis) */
    this.init_time = 0;

    /** @property {Int} - The multiple of x axis interval (ex: 4 = 1/4s = 0.25s) */
    this.multiple = 4; //can only set to non prime number... such as 1 2 4 10

    /** @property {Int} - The maximum x axis value*/
    this.max_x = 30 + 1;

    /** @property {Int} - The default/minimum y axis value*/
    this.max_y_default = 0.10/130*100

    /** @property {Int} - The maximum y axis value*/
    this.max_y = this.max_y_default; //*1000 is to convert V to mV;

    /** @property {Int} - The interval of x axis*/
    this.x_interval = 1000/this.multiple; // 1 second

    /** @property {Object} - chart.js object*/
    this.data_chart;

    /** @property {Dictionary} - The leading point color on a voltage line*/
    this.point_color_leading = ['#e74c3c','#f1c40f','#2c3e50','#8e44ad']
    /** @property {Dictionary} - The color of a voltage line*/
    this.point_color_default = [Na.color, Cl.color, K.color, 'gray']

    this.initialize();
    setInterval(this.plot.bind(this), this.x_interval);
  }

  /**
  * Function to initialize the plot by using chart.js
  * @access private
  */
  initialize() {
    var ctx = document.getElementById('dataPlot').getContext('2d');

    this.data_chart = new Chart (ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Na',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: this.point_color_default[0],
            backgroundColor: this.point_color_default[0],
            pointBorderColor: [],
            pointBackgroundColor: [],
          },
          {
            label: 'Cl',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: this.point_color_default[1],
            backgroundColor: this.point_color_default[1],
            pointBorderColor: [],
            pointBackgroundColor: [],
            hidden: true,
          },
          {
            label: 'K',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: this.point_color_default[2],
            backgroundColor: this.point_color_default[2],
            pointBorderColor: [],
            pointBackgroundColor: [],
            hidden: true,
          },
          {
            label: 'Net',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: 'gray',
            backgroundColor: 'gray',
            pointBorderColor: [],
            pointBackgroundColor: [],
            hidden: true,
          }
        ]
      },
      options: {
        // maintainAspectRatio :false,
        //   responsive: false
      }
    });

    // this.resizeAxis();
  }

  /**
  * When user check on the plot legend
  * @access private
  * @param {DOM} e - Clicked DOM elements
  * @param {Object} legend_item - chart.js legend object
  */
  onClick(e, legend_item) {
    var ci = this.data_chart;
    var cur_graph = this;

    var index = legend_item.datasetIndex;

    if (this.sim.simMode() == "Nernst" & index != 3) { //index 3 is the net voltage
      var checkBox_particle = this.sim.dom.sim_inputs.checkboxes[index].elt.innerText;

      this.sim.dom.sim_inputs.checkbox(index, true);
      cur_graph.hidePlot(index, false);
      enableInputForParticle(checkBox_particle);

      if (this.sim.paused) { //If the plot is paused, change the plot particle
        var particle_type = this.sim.particle_types[index];
        var voltage = this.sim.nernst_eq.compute(particle_type);
        var dataset = ci.data.datasets[index].data;
        ci.data.datasets[index].data = dataset;
      }

      ci.data.datasets.forEach(function(e, i) {
        if (i !== index && i != 3) {

          //Hide the plot only if it is enabled... TO avoid css problem
          if(cur_graph.sim.dom.sim_inputs.checkboxes[i].elt.getElementsByTagName('input')[0].checked) {
            var checkBox_particle = cur_graph.sim.dom.sim_inputs.checkboxes[i].elt.innerText;

            cur_graph.sim.dom.sim_inputs.checkbox(i, false);
            cur_graph.hidePlot(i, true);
            disableInputForParticle(checkBox_particle);
          }

        }
      })

      ci.update();

    }
  }

  /**
  * Function to plot the voltage plot in every time frame interval
  * @access private
  */
  plot() {
    if (!this.sim.paused) { //If the plot is not paused

      for (var i = 0; i < 4; i++) {
        if (i < 3) {
          var particle_type = this.sim.particle_types[i];
          var voltage = this.sim.nernst_eq.compute(particle_type);
        } else if (i == 3) { // the net voltage
          var voltage = this.sim.goldman_eq.compute();
        }

        this.updateData(i, this.init_time, voltage*1000); //*1000 is to convert V to mV
      }

      this.init_time=this.init_time+1/this.multiple;

      if (this.init_time > this.max_x - 1) {
        this.init_time = 0;
      }

    }
  }

  /**
  * Hide or unhide a voltage plot
  * @access public
  * @param {Int} legendIndex - The index of voltage plot (ex: 0=Na,1=Cl,2=K,3=Net)
  * @param {Boolean} value - to hide or unhide
  */
  hidePlot(legendIndex, value) {
    // Input1: int
    // Input2: Boolean
    this.data_chart.getDatasetMeta(legendIndex).hidden = value;
  }

  /**
  * Update the voltage value of the plot
  * @access private
  * @param {Int} index - The index of voltage plot (ex: 0=Na,1=Cl,2=K,3=Net)
  * @param {Int} x - The time index (ex: x interval = 0.25, then 0 = 0s, 1 = 0.25s, 2 = 0.5s, etc.)
  * @param {Int} y - The voltage value respect to the x
  */
  updateData(index, x, y) {
    // Input1: int
    // Input2: int
    // Input3: int
    var dataset = this.data_chart.data.datasets[index].data;

    var new_data = {
      x: x,
      y: y
    }


    dataset[x*this.multiple] = new_data

    //Create the gap
    for (let i = 0;i<round((this.max_x-1)/5);i++) {

      if ( (x+1/this.multiple*(i+1)) > this.max_x - 1) {
        var next_data = {
          x: (this.multiple-i),
          y: NaN
        }
        var next_index = (this.multiple-i);
      } else {
        var next_data = {
          x: x+1/this.multiple*(i+1),
          y: NaN
        }
        var next_index = x*this.multiple+1+i;
      }
      dataset[next_index] = next_data
    }


    //Change the leading point color
    this.data_chart.data.datasets[index].pointBackgroundColor[x*this.multiple] = this.point_color_leading[index];
    this.data_chart.data.datasets[index].pointBorderColor[x*this.multiple] = this.point_color_leading[index];

    var prevIndex = (x>0) ? x*this.multiple-1 : (this.max_x - 1)*this.multiple
    this.data_chart.data.datasets[index].pointBackgroundColor[prevIndex] =  this.point_color_default[index];
    this.data_chart.data.datasets[index].pointBorderColor[prevIndex] =  this.point_color_default[index];


    if(this.sim.simMode() == "Nernst") {
      if(this.sim.dom.sim.nernst_particle == this.sim.particle_types[index])
      this.checkYaxis(index);

    } else {
      this.checkYaxis(index);
    }


    this.data_chart.data.datasets[index].data = dataset;
    this.data_chart.data.datasets[index].data;
    this.data_chart.update();


  }

  /**
  * Check if current plot voltage value exceed the maximum y axis value
  * @access private
  * @param {Int} index - The index of voltage plot (ex: 0=Na,1=Cl,2=K,3=Net)
  */
  checkYaxis(index) {

    var max_voltage = 0;
    if(this.sim.simMode() == "Nernst") {

      for(let i =0;i<this.data_chart.data.datasets[index].data.length;i++) {

        var dataSet = this.data_chart.data.datasets[index].data[i];
        if(dataSet) {
          if(Math.abs(dataSet.y/1000)>max_voltage && isFinite(dataSet.y))
          max_voltage=Math.abs(dataSet.y/1000)
        }
      }


    } else {
      for(let j = 0; j < 4; j++) {

        for(let i = 0; i < this.data_chart.data.datasets[j].data.length; i++) {

          var dataSet = this.data_chart.data.datasets[j].data[i];
          if(dataSet) {
            if(Math.abs(dataSet.y/1000)>max_voltage && isFinite(dataSet.y))
            max_voltage=Math.abs(dataSet.y/1000)
          }
        }

      }
    }

    // console.log(max_voltage)

    if(this.max_y<=max_voltage) {
      this.max_y = max_voltage
      this.resizeAxis();
    } else if(max_voltage < this.max_y_default) {
      this.max_y = this.max_y_default
      this.resizeAxis();
    }
    // else if(this.max_y != this.max_y_default) {
    //   this.max_y=this.max_y_default
    //   this.resizeAxis();
    // }
  }

  /**
  * Resize y-axis automatically whenever the maximum voltage is changed
  * @access private
  */
  resizeAxis() {
    //Resize y-axis automatically
    this.data_chart.options = {
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
            ticks: {
              beginAtZero: true,
              steps: 1,
              stepValue: 1,
              max: this.max_x - 1
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
              min: -this.max_y*1300,
              stepSize: (2*1300 * this.max_y)/6,
              max: this.max_y*1300
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


    this.data_chart.update();
  }
}
