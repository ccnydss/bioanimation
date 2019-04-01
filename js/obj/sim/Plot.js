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
  * @param {Object} m_dom - Current simulator DOM object
  * @access public
  */
  constructor(m_sim) {
    this.m_sim = m_sim;

    /** @property {Int} - The initial time (x axis) */
    this.m_time = 0;

    /** @property {Int} - The multiple of x axis interval (ex: 4 = 1/4s = 0.25s) */
    this.multiple = 4; //can only set to non prime number... such as 1 2 4 10

    /** @property {Int} - The maximum x axis value*/
    this.m_max_x = 30 + 1;

    /** @property {Int} - The default/minimum y axis value*/
    this.m_max_y_default = 0.10/130*100

    /** @property {Int} - The maximum y axis value*/
    this.m_max_y = this.m_max_y_default; //*1000 is to convert V to mV;

    /** @property {Int} - The interval of x axis*/
    this.m_interval = 1000/this.multiple; // 1 second

    /** @property {Object} - chart.js object*/
    this.m_data_chart;

    // this.m_data_chart_global_voltage = [];
    /** @property {Dictionary} - The leading point color on a voltage line*/
    this.m_point_color_leading = ['#e74c3c','#f1c40f','#2c3e50','#8e44ad']
    /** @property {Dictionary} - The color of a voltage line*/
    this.m_point_color_default = [Na.color, Cl.color, K.color, 'gray']

    this.initialize();
    setInterval(this.plot.bind(this), this.m_interval);
  }

  /**
  * Function to initialize the plot by using chart.js
  * @access private
  */
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
            pointRadius: 1,
            borderColor: this.m_point_color_default[0],
            backgroundColor: this.m_point_color_default[0],
            pointBorderColor: [],
            pointBackgroundColor: [],
          },
          {
            label: 'Cl',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: this.m_point_color_default[1],
            backgroundColor: this.m_point_color_default[1],
            pointBorderColor: [],
            pointBackgroundColor: [],
            hidden: true,
          },
          {
            label: 'K',
            fill: false,
            data: [],
            pointRadius: 1,
            borderColor: this.m_point_color_default[2],
            backgroundColor: this.m_point_color_default[2],
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
    * @param {Object} legendItem - chart.js legend object
    */
  onClick(e, legendItem) {
    var ci = this.m_data_chart;
    var curGraph = this;

    var index = legendItem.datasetIndex;

    if (this.m_sim.simMode() == "Nernst" & index != 3) { //index 3 is the net voltage
      var checkBoxParticle = this.m_sim.m_dom.m_sim_controls.checkboxes[index].elt.innerText;

      this.m_sim.m_dom.m_sim_controls.checkbox(index, true);
      curGraph.hidePlot(index, false);
      enableInputForParticle(checkBoxParticle);

      if (this.m_sim.m_pause) { //If the plot is paused, change the plot particle
        var particleType = this.m_sim.m_particle_types[index];
        var voltage = this.m_sim.m_nernst_eq.compute(particleType);
        var dataset = ci.data.datasets[index].data;
        ci.data.datasets[index].data = dataset;
      }

      ci.data.datasets.forEach(function(e, i) {
        if (i !== index && i != 3) {
          var checkBoxParticle = this.m_sim.m_dom.m_sim_controls.checkboxes[i].elt.innerText;

          this.m_sim.m_dom.m_sim_controls.checkbox(i, false);
          curGraph.hidePlot(i, true);

          disableInputForParticle(checkBoxParticle);
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
    if (!this.m_sim.m_pause) { //If the plot is not paused

      for (var i = 0; i < 4; i++) {
        if (i < 3) {
          var particleType = this.m_sim.m_particle_types[i];
          var voltage = this.m_sim.m_nernst_eq.compute(particleType);
        } else if (i == 3) { // the net voltage
          var voltage = this.m_sim.m_goldman_eq.compute();
        }

        this.updateData(i, this.m_time, voltage*1000); //*1000 is to convert V to mV
      }

      this.m_time=this.m_time+1/this.multiple;

      if (this.m_time > this.m_max_x - 1) {
        this.m_time = 0;
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
    this.m_data_chart.getDatasetMeta(legendIndex).hidden = value;
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
    var dataset = this.m_data_chart.data.datasets[index].data;

    var newData = {
      x: x,
      y: y
    }


    // if(!this.m_data_chart_global_voltage[index])
    // this.m_data_chart_global_voltage[index] = []

    // this.m_data_chart_global_voltage[index][x*this.multiple] = y

    dataset[x*this.multiple] = newData

    //Create the gap
    for (let i = 0;i<round((this.m_max_x-1)/5);i++) {

      if ( (x+1/this.multiple*(i+1)) > this.m_max_x - 1) {
        var nextData = {
          x: (this.multiple-i),
          y: NaN
        }
        var nextIndex = (this.multiple-i);
      } else {
        var nextData = {
          x: x+1/this.multiple*(i+1),
          y: NaN
        }
        var nextIndex = x*this.multiple+1+i;
      }
      dataset[nextIndex] = nextData
    }


    //Change the leading point color
      this.m_data_chart.data.datasets[index].pointBackgroundColor[x*this.multiple] = this.m_point_color_leading[index];
      this.m_data_chart.data.datasets[index].pointBorderColor[x*this.multiple] = this.m_point_color_leading[index];

      var prevIndex = (x>0) ? x*this.multiple-1 : (this.m_max_x - 1)*this.multiple
      this.m_data_chart.data.datasets[index].pointBackgroundColor[prevIndex] =  this.m_point_color_default[index];
      this.m_data_chart.data.datasets[index].pointBorderColor[prevIndex] =  this.m_point_color_default[index];


      if(this.m_sim.simMode() == "Nernst") {
        if(this.m_sim.m_dom.m_sim.m_nernst_particle == this.m_sim.m_particle_types[index])
        this.checkYaxis(index);

      } else {
    this.checkYaxis(index);
      }


        this.m_data_chart.data.datasets[index].data = dataset;
        this.m_data_chart.data.datasets[index].data;
    this.m_data_chart.update();


  }

  /**
  * Check if current plot voltage value exceed the maximum y axis value
  * @access private
  * @param {Int} index - The index of voltage plot (ex: 0=Na,1=Cl,2=K,3=Net)
  */
  checkYaxis(index) {

        var maxVoltage = 0;
        if(this.m_sim.simMode() == "Nernst") {

          // maxVoltage = Math.abs(this.m_data_chart_global_voltage[index].max()/1000) //To mV

          for(let i =0;i<this.m_data_chart.data.datasets[index].data.length;i++) {

            var dataSet = this.m_data_chart.data.datasets[index].data[i];
                if(dataSet) {
                  if(Math.abs(dataSet.y/1000)>maxVoltage && isFinite(dataSet.y))
                  maxVoltage=Math.abs(dataSet.y/1000)
                }
          }


        } else {
          for(let j = 0; j < 4; j++) {
            // var localMax = Math.abs(this.m_data_chart_global_voltage[i].max()/1000) //To mV

            // maxVoltage = (localMax>maxVoltage) ? localMax : maxVoltage;

            for(let i =0;i<this.m_data_chart.data.datasets[j].data.length;i++) {

              var dataSet = this.m_data_chart.data.datasets[j].data[i];
                  if(dataSet) {
                    if(Math.abs(dataSet.y/1000)>maxVoltage && isFinite(dataSet.y))
                    maxVoltage=Math.abs(dataSet.y/1000)
                  }
            }

          }
        }

        // console.log(maxVoltage)

        if(this.m_max_y<=maxVoltage) {
          this.m_max_y = maxVoltage
          this.resizeAxis();
        } else if(maxVoltage < this.m_max_y_default) {
          this.m_max_y = this.m_max_y_default
          this.resizeAxis();
        }
        // else if(this.m_max_y != this.m_max_y_default) {
        //   this.m_max_y=this.m_max_y_default
        //   this.resizeAxis();
        // }
  }

    /**
    * Resize y-axis automatically whenever the maximum voltage is changed
    * @access private
    */
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
              min: -this.m_max_y*1300,
              stepSize: (2*1300 * this.m_max_y)/6,
              max: this.m_max_y*1300
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
