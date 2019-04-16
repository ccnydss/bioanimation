
class Fps {
  constructor() {
    this.interval = 1000
    this.time = 0;
    this.avg_time = 20;


    this.init('plotFor','plot For loop performance took: ')
    this.init('plotData','plot Data performance took: ')
    this.init('container','container performance took: ')

    var _fps = this


    setInterval(
      function() {
      // _fps.start('fps')

        // console.log('%c------------------------','background: #222; color: #bada55')
        // _fps.log('plotFor')
        // _fps.log('plotData')
        // _fps.log('container')

      // _fps.end('fps')

        // _fps.log('fps')

        if(_fps.time<_fps.avg_time) {
          _fps.time = _fps.time + 1;
        }

      }

      ,this.interval
    )

  }

  init(event, content) {
    this[event] = {}
    Object.assign(this[event],
      {
        lastLoop: performance.now(),
        content: content,
        totalLoop: 0,
        average: 0
      })
    }

    start(event) {
      if(this[event])
      this[event].lastLoop = performance.now();
    }

    end(event) {
      if(this[event])
      this[event].thisLoop = performance.now();
      // var fps = 1000 / (this[event].thisLoop - this[event].lastLoop);
      // fps = Math.min(1, fps) * 60

      // console.log(this[event].content+fps)
      // this[event].lastLoop = this[event].thisLoop;
    }

    log(event) {

      var ave = (this[event].average>0) ? '; The average is '+this[event].average : ''
      console.log(this[event].content  + (this[event].thisLoop - this[event].lastLoop) + " milliseconds."+ave);

      if(this.time<this.avg_time) {
        this[event].totalLoop = this[event].totalLoop + this[event].thisLoop - this[event].lastLoop
        this[event].average = this[event].totalLoop/this.time
      }

    }
  }
