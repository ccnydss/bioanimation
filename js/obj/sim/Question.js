var questionDebug = false;

class Question {
  constructor() {
    var current = this
    this.loadJSON(function(response) {
      // Parse JSON string into object
      current.m_question_list = JSON.parse(response);
    },'questions.json');

    this.m_min = 1;
    this.m_current = 1;
    this.m_current_selection = 0;
    this.m_max_index = 5;

    this.m_prev_disabled = true;
    this.m_next_disabled = false;

    this.m_header = "Goldman-Hodgkin-Katz";
  }

  init(mode) {
    this.m_current = 1;
    this.m_mode = mode;
    this.m_index = this.m_question_list[mode].length;

    document.getElementById("q1").innerHTML = this.m_question_list[mode][0]
    if (this.m_jumpDiv) {
      this.refresh(0)
      this.focus(0)
    }

    this.checkDisable('prev')
  }

  setup() {
    var ec = elementCreator;

    // Create the div to actually contain the questions.
    this.m_container = ec("div", 'questionsdiv', 'leftbar', { className: "questions-scroll"});
    this.m_title = ec("h3", 'questionTitle', 'questionsdiv', { content: this.m_header })

    var questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions";
    this.m_text = ec("p", 'q1', 'questionsdiv', { className: 'questions questions-scroll', content: questionsText });

    this.m_control = ec("div", 'questionControl', 'questionsdiv', { className: 'container'} );
    this.m_prev = ec("button", 'questionPrev', 'questionControl', { content: 'Previous' });
    this.m_prev.mouseClicked(this.prev.bind(this));
    this.m_prev.attribute("disabled", ''); //We are already in first question, so disabled prev btn at default

    this.m_jumpDiv = ec("div", 'questionJumpDiv', 'questionControl', { className: 'container'} );
    // this.m_jump = ec("div", 'questionJump', 'questionJumpDiv', { content: 'Jump' });

    this.refresh(0)
    this.focus(0)

    this.m_next = ec("button", 'questionNext', 'questionControl', { content: 'Next' });
    this.m_next.mouseClicked(this.next.bind(this));
  }

  next() {
    if (this.m_next_disabled)
    return;

    this.m_current++;

    // Checking refresh jump btn menu
    var allow_index = (this.m_index>=this.m_max_index) ? this.m_max_index : this.m_index
    var max_num = this.m_jump_list[allow_index - 1].html();
    if (this.m_current>max_num) {
      questionDebug && console.log("Maximum page exceed! "+"Current: "+this.m_current+" MaxJump: "+max_num)
      this.refresh(this.m_current - allow_index + 1)
    }

    this.m_current_selection = (this.m_current>max_num) ? allow_index - 1 : this.m_current_selection+1
    this.focus(this.m_current_selection)
    questionDebug && console.log("Next index is "+(this.m_current_selection))

    // Checking disable btn or not
    this.checkDisable('next')
    document.getElementById("q1").innerHTML = this.m_question_list[this.m_mode][this.m_current - 1]
  }

  prev() {
    if (this.m_prev_disabled)
    return;

    this.m_current--;

    // Checking refresh jump btn menu
    // If current Minimum page > 1 && current page < current Minimum page
    var allow_index = (this.m_index>=this.m_max_index) ? this.m_max_index : this.m_index
    var min_num = this.m_jump_list[0].html();
    var max_num = this.m_jump_list[allow_index - 1].html();

    if (min_num >= this.m_min  && this.m_current<min_num) {
      questionDebug && console.log("Minimum page exceed! "+"Current: "+this.m_current+" MaxJump: "+max_num)
      this.refresh(this.m_current)
    }

    this.m_current_selection = (max_num > allow_index && this.m_current_selectio) ? this.m_current_selection : this.m_current_selection - 1
    if(this.m_current_selection<0) this.m_current_selection=0
    this.focus(this.m_current_selection)
    questionDebug && console.log("Prev index is "+(this.m_current_selection))

    // Checking disable btn or not
    this.checkDisable('prev')
    document.getElementById("q1").innerHTML = this.m_question_list[this.m_mode][this.m_current - 1]
  }

  refresh(init) {
    // input1: int
    // usage: if 0 then create the new jump menu, if >0 then refresh current jump menu
    if (init<=0) {
      this.m_jumpDiv.html('') //delete current container children
      // if(this.m_jump_list) this.m_jump_list.remove()
      this.m_jump_list = [];
      this.m_jump_dot = [];
    }

    for (let i = 0;i<this.m_max_index;i++) {
      if (i>=this.m_index) continue

      //create the ... context
      if (init<=0) {
        if(i==0) this.m_jump_dot[0] = elementCreator("div", 'jumDot0', 'questionJumpDiv', { content: '...', className: 'jumpDot'} );
        this.m_jump_list[i] = elementCreator("button", 'jumpBtn'+i, 'questionJumpDiv', { content: i+1, className: 'jumpBtn'} );
        this.m_jump_list[i].mouseClicked(this.jump.bind(this));
        var allow_index = (this.m_index>=this.m_max_index) ? this.m_max_index : this.m_index
        if(i==(allow_index - 1)) this.m_jump_dot[1] = elementCreator("div", 'jumDot1', 'questionJumpDiv', { content: '...', className: 'jumpDot'} );

      } else {
        questionDebug && console.log(this.m_jump_list[i]+" Refreshing to "+(init+i))
        this.m_jump_list[i].html(init+i)
      }

    }

  }

  jump(evt) {
    var eventHTML = evt.target.innerHTML;
    var eventID = evt.target.id;

    var curIndex = parseInt(evt.target.id.replace("jumpBtn",""))
    questionDebug && console.log("Toggle index is "+curIndex+" cur index is "+eventHTML)

    this.m_current = eventHTML;
    document.getElementById("q1").innerHTML = this.m_question_list[this.m_mode][this.m_current - 1]

    this.m_current_selection = curIndex;
    this.focus(this.m_current_selection)

    var allow_index = (this.m_index>=this.m_max_index) ? this.m_max_index : this.m_index
    if(curIndex>=allow_index - 1) {
      this.checkDisable('next')
    } else if(eventHTML<=1) {
      this.checkDisable('prev')
    } else {
      this.checkDisable('both')
    }

  }

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

  focus(index) {
    this.m_current_selection = index;
    for (let i = 0;i<this.m_max_index;i++) {
      if (i>=this.m_index) continue

      if(index != i) {
        // if(this.m_jump_list[i].attribute("selection")) This line will cause some bug...
        this.m_jump_list[i].removeAttribute("target");

      } else if (!this.m_jump_list[i].attribute("target")) {
        this.m_jump_list[i].attribute("target","")
      }
    }
  }

  checkDisable(mode) {
    // input1: string (next||prev|both)

    // enable ... or not
    var allow_index = (this.m_index>=this.m_max_index) ? this.m_max_index : this.m_index
    var max = parseInt(this.m_jump_list[allow_index - 1].html())
    var min = parseInt(this.m_jump_list[0].html())


    if(this.m_jump_dot[0] && min > 1) {
      this.m_jump_dot[0].show()
    } else { this.m_jump_dot[0].hide() }

    if(this.m_jump_dot[1] && max < this.m_index) {
      this.m_jump_dot[1].show()
    } else { this.m_jump_dot[1].hide() }

    // enable btn or not
    if(mode=='next') {
      if (this.m_current>=this.m_index) {
        this.m_current = this.m_index;
        this.m_next.attribute("disabled", '');
        this.m_next.style("visibility",'hidden')
        this.m_next_disabled = true;
        if(this.m_jump_dot[1]) this.m_jump_dot[1].hide()
      }

      if (this.m_prev_disabled) {
        this.m_prev_disabled=false
        this.m_prev.removeAttribute("disabled");
        this.m_prev.style("visibility",'')
      }

    } else if(mode=='prev') {
      if (this.m_current<=this.m_min) {
        this.m_current = this.m_min;
        this.m_prev.attribute("disabled", '');
        this.m_prev.style("visibility",'hidden')
        this.m_prev_disabled = true;
        if(this.m_jump_dot[0]) this.m_jump_dot[0].hide()
      }

      if (this.m_next_disabled) {
        this.m_next_disabled=false
        this.m_next.removeAttribute("disabled");
        this.m_next.style("visibility",'')
      }

    } else {
      if (this.m_prev_disabled) {
        this.m_prev_disabled=false
        this.m_prev.removeAttribute("disabled");
        this.m_prev.style("visibility",'')
      }

      if (this.m_next_disabled) {
        this.m_next_disabled=false
        this.m_next.removeAttribute("disabled");
        this.m_next.style("visibility",'')
      }
    }
  }

}
