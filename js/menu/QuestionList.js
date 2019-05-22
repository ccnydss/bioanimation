var questionDebug = false;

class QuestionList {
  /**
  * Create a question menu.
  * @example <caption>Create a new question menu.</caption>
  mainSim.sim.dom.sim_question = new QuestionList(this);
  mainSim.sim.dom.sim_question.setup();
  mainSim.sim.dom.sim_question.init("Goldman"); // or "Nersnt"
  *
  * @access public
  */
  constructor() {
    var current = this
    this.loadJSON(function(response) {
      // Parse JSON string into object
      /** @property {JSON} - The question list parsed from a JSON file */
      current.question_list = JSON.parse(response);
    },'questions.json');

    /** @property {Int} - The minimum page number */
    this.min_page = 1;
    /** @property {Int} - The current selected page number */
    this.current_page = 1;
    /** @property {Int} - The current selected index (NOT page) number */
    this.current_index = 0;
    /** @property {Int} - The maximum index (NOT page) number */
    this.max_index = 5;

    /** @property {Boolean} - If true, then previous page button is disabled */
    this.prev_disabled = true;
    /** @property {Boolean} - If true, then next page button is disabled */
    this.next_disabled = false;

    /** @property {Boolean} - The current question title */
    this.header = "Goldman-Hodgkin-Katz";
  }

  /**
  * Function to initialize variables in question menu
  * @access public
  * @param {String} mode - The current simulation mode
  */
  init(mode) {
    this.current_page = 1;

    /** @property {String} - Nernst/Goldman */
    this.mode = mode;
    this.question_list = questions;
    this.total_index = this.question_list[mode].length;

    console.log("Mode is: ", mode, questions[mode][0]);
    questions[mode][0].display("q1");

    if (this.jump_div) {
      this.refresh(0)
      this.focus(0)
    }

    this.checkDisable('prev')
  }

  /**
  * Function to initialize DOM element in question menu
  * @access private
  */
  setup() {
    var ec = elementCreator;

    // Create the div to actually contain the questions.
    this.container = ec("div", 'questionsdiv', 'leftbar', { className: "questions-scroll"});
    this.title = ec("h3", 'questionTitle', 'questionsdiv', { content: this.header })

    var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
    this.question_text = ec("p", 'q1', 'questionsdiv', { className: 'questions questions-scroll', content: questionsText });

    this.control_grp = ec("div", 'questionControl', 'questionsdiv', { className: 'container'} );
    this.prev_btn = ec("button", 'questionPrev', 'questionControl', { content: 'Previous' });
    this.prev_btn.mouseClicked(this.prev.bind(this));
    this.prev_btn.attribute("disabled", ''); //We are already in first question, so disabled prev btn at default

    this.jump_div = ec("div", 'questionJumpDiv', 'questionControl', { className: 'container'} );

    this.refresh(0)
    this.focus(0)

    this.next_btn = ec("button", 'questionNext', 'questionControl', { content: 'Next' });
    this.next_btn.mouseClicked(this.next.bind(this));
  }

  /**
  * Function to jump to next page in question menu
  * @access public
  */
  next() {
    if (this.next_disabled)
    return;

    this.current_page++;

    // Checking refresh jump btn menu
    var allow_index = (this.total_index >= this.max_index) ? this.max_index : this.total_index
    var max_num = this.jump_list[allow_index - 1].html();
    if (this.current_page>max_num) {
      questionDebug && console.log("Maximum page exceed! "+"Current: "+this.current_page+" MaxJump: "+max_num)
      this.refresh(this.current_page - allow_index + 1)
    }

    this.current_index = (this.current_page>max_num) ? allow_index - 1 : this.current_index+1
    this.focus(this.current_index)
    questionDebug && console.log("Next index is "+(this.current_index))

    // Checking disable btn or not
    this.checkDisable('next')
    document.getElementById("q1").innerHTML = this.question_list[this.mode][this.current_page - 1]
  }

  /**
  * Function to jump to previous page in question menu
  * @access public
  */
  prev() {
    if (this.prev_disabled)
    return;

    this.current_page--;

    // Checking refresh jump btn menu
    // If current Minimum page > 1 && current page < current Minimum page
    var allow_index = (this.total_index>=this.max_index) ? this.max_index : this.total_index
    var min_num = this.jump_list[0].html();
    var max_num = this.jump_list[allow_index - 1].html();

    if (min_num >= this.min_page  && this.current_page<min_num) {
      questionDebug && console.log("Minimum page exceed! "+"Current: "+this.current_page+" MaxJump: "+max_num)
      this.refresh(this.current_page)
    }

    this.current_index = (max_num > allow_index && this.current_index) ? this.current_index : this.current_index - 1
    if(this.current_index<0) this.current_index=0
    this.focus(this.current_index)
    questionDebug && console.log("Prev index is "+(this.current_index))

    // Checking disable btn or not
    this.checkDisable('prev')
    document.getElementById("q1").innerHTML = this.question_list[this.mode][this.current_page - 1]
  }

  /**
  * Function to refresh the dots (...) in the question menu
  * @access private
  * @param {Int} init - The current selected index.
  If 0 then create the new jump menu, if >0 then refresh current jump menu
  */
  refresh(init) {
    if (init<=0) {
      this.jump_div.html('') //delete current container children
      this.jump_list = [];
      this.jump_dot = [];
    }

    for (let i = 0;i<this.max_index;i++) {
      if (i>=this.total_index) continue

      //create the ... context
      if (init<=0) {
        if(i==0) this.jump_dot[0] = elementCreator("div", 'jumDot0', 'questionJumpDiv', { content: '...', className: 'jumpDot'} );
        this.jump_list[i] = elementCreator("button", 'jumpBtn'+i, 'questionJumpDiv', { content: i+1, className: 'jumpBtn'} );
        this.jump_list[i].mouseClicked(this.jump.bind(this));
        var allow_index = (this.total_index>=this.max_index) ? this.max_index : this.total_index
        if(i==(allow_index - 1)) this.jump_dot[1] = elementCreator("div", 'jumDot1', 'questionJumpDiv', { content: '...', className: 'jumpDot'} );

      } else {
        questionDebug && console.log(this.jump_list[i]+" Refreshing to "+(init+i))
        this.jump_list[i].html(init+i)
      }

    }

  }

  /**
  * Function to jump to desired page
  * @access private
  * @param {DOM} evt - The page number DOM that is being clicked
  */
  jump(evt) {
    var eventHTML = evt.target.innerHTML;
    var eventID = evt.target.id;

    var curIndex = parseInt(evt.target.id.replace("jumpBtn",""))
    questionDebug && console.log("Toggle index is "+curIndex+" cur index is "+eventHTML)

    this.current_page = eventHTML;
    document.getElementById("q1").innerHTML = this.question_list[this.mode][this.current_page - 1]

    this.current_index = curIndex;
    this.focus(this.current_index)

    var allow_index = (this.total_index>=this.max_index) ? this.max_index : this.total_index
    if(curIndex>=allow_index - 1) {
      this.checkDisable('next')
    } else if(eventHTML<=1) {
      this.checkDisable('prev')
    } else {
      this.checkDisable('both')
    }

  }

  /**
  * Function to load JSON file
  * @access private
  * @param {callback} callback
  * @param {url} url - The file name of the JSON file
  */
  loadJSON(callback,url) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  /**
  * Function add CSS to current active page tab
  * @access private
  * @param {Int} index - The current active index number
  */
  focus(index) {
    this.current_index = index;
    for (let i = 0;i<this.max_index;i++) {
      if (i>=this.total_index) continue

      if(index != i) {
        // if(this.jump_list[i].attribute("selection")) This line will cause some bug... use trigger instead
        this.jump_list[i].removeAttribute("target");

      } else if (!this.jump_list[i].attribute("target")) {
        this.jump_list[i].attribute("target","")
      }
    }
  }

  /**
  * Function check if next/prev button should be disabled or not
  * @access private
  * @param {String} mode - (next|prev|both)
  */
  checkDisable(mode) {

    // enable ... or not
    var allow_index = (this.total_index>=this.max_index) ? this.max_index : this.total_index
    var max = parseInt(this.jump_list[allow_index - 1].html())
    var min = parseInt(this.jump_list[0].html())


    if(this.jump_dot[0] && min > 1) {
      this.jump_dot[0].show()
    } else { this.jump_dot[0].hide() }

    if(this.jump_dot[1] && max < this.total_index) {
      this.jump_dot[1].show()
    } else { this.jump_dot[1].hide() }

    // enable btn or not
    if(mode=='next') {
      if (this.current_page>=this.total_index) {
        this.current_page = this.total_index;
        this.next_btn.attribute("disabled", '');
        this.next_btn.style("visibility",'hidden')
        this.next_disabled = true;
        if(this.jump_dot[1]) this.jump_dot[1].hide()
      }

      if (this.prev_disabled) {
        this.prev_disabled=false
        this.prev_btn.removeAttribute("disabled");
        this.prev_btn.style("visibility",'')
      }

    } else if(mode=='prev') {
      if (this.current_page<=this.min_page) {
        this.current_page = this.min_page;
        this.prev_btn.attribute("disabled", '');
        this.prev_btn.style("visibility",'hidden')
        this.prev_disabled = true;
        if(this.jump_dot[0]) this.jump_dot[0].hide()
      }

      if (this.next_disabled) {
        this.next_disabled=false
        this.next_btn.removeAttribute("disabled");
        this.next_btn.style("visibility",'')
      }

    } else {
      if (this.prev_disabled) {
        this.prev_disabled=false
        this.prev_btn.removeAttribute("disabled");
        this.prev_btn.style("visibility",'')
      }

      if (this.next_disabled) {
        this.next_disabled=false
        this.next_btn.removeAttribute("disabled");
        this.next_btn.style("visibility",'')
      }
    }
  }

}
