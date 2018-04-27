function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  stage = createDiv('');
  stage.id('stage');
  stage.class('flex-container');
  stage.size(windowWidth, windowHeight);
  // stage.style('background-color',color(0));

  // The right sidebar for displaying questions.
  leftBox = createDiv("");
  leftBox.id('leftbar');
  leftBox.parent('stage');
  leftBox.size(0.25 * 0, windowHeight - 8);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)

  // Create the div to actually contain the questions.
  // questions = createDiv("");
  // questions.id('questionsdiv');
  // questions.parent('leftbar');
  // questions.size(0.25 * windowWidth, windowHeight - 8);
  // createElement("h3", "Questions").parent('questionsdiv');
  //
  // var questions
  // function httpGet(theUrl){
  //   if (window.XMLHttpRequest) {
  //       xmlhttp=new XMLHttpRequest();
  //   } else {
  //       xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  //   }
  //   xmlhttp.onreadystatechange=function() {
  //       if (xmlhttp.readyState==4 && xmlhttp.status==200) {
  //           questions = xmlhttp.responseText.split("\n").slice(0, 10);
  //       }
  //   }
  //   xmlhttp.open("GET", theUrl, false);
  //   xmlhttp.send();
  // }
  // text_url = "https://raw.githubusercontent.com/alexmat2on/bioanimation/master/js/questions.txt?token=AIFGvR-d8l4EIi7O2kck0gS_llf5KrSLks5a42aZwA%3D%3D";
  // httpGet(text_url);
  //
  //   var qmax = questions.length - 1;
  //   var q = 0;
  //   var question = createElement("p",questions[q]).parent('questionsdiv');
  //   question.class("questions");
  //   question.id("q1");
  //
  //
  //   questionBotton = createDiv("");
  //   questionBotton.id('questionBotton');
  //   questionBotton.class('questionButton');
  //   questionBotton.parent('questionsdiv');
  //
  //   questionNext = createButton('Previous');
  //   questionNext.id('questionPrev');
  //   questionNext.parent('questionBotton');
  //   questionNext.size(leftBox.size().width, 0.075 * leftBox.size().height);
  //   questionNext.mousePressed(quesPrev);
  //   document.getElementById("questionPrev").style.display= "none";
  //
  //   questionPrev = createButton('Next');
  //   questionPrev.id('questionNext');
  //   questionPrev.parent('questionBotton');
  //   questionPrev.size(leftBox.size().width, 0.075 * leftBox.size().height);
  //   questionPrev.mousePressed(quesNext);
  //
  //
  //   function quesNext(evt) {
  //     if (q>=qmax-1) {
  //       //alert(q+" "+qmax)
  //       document.getElementById("questionNext").style.display= "none";
  //       q = qmax;
  //     } else {
  //     q = q+1;
  //         document.getElementById("questionPrev").style.display= "";
  //       }
  //         document.getElementById("q1").innerHTML = questions[q];
  //   }
  //
  //   function quesPrev(evt) {
  //     if (q<=1) {
  //       document.getElementById("questionPrev").style.display= "none";
  //       q = 0;
  //     } else {
  //     q = q-1;
  //         document.getElementById("questionNext").style.display= "";
  //       }
  //         document.getElementById("q1").innerHTML = questions[q];
  //   }
  // for (var i=0; i<questions.length; i++){
  //   var q = questions[i];
  //   var question = createElement("p",q).parent('questionsdiv');
  //   question.class("questions");
  //   question.id("q" + (i+1));
  // }
  // single_question.id("q0");
  // single_question.parent('questionsdiv');



  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('leftbar');
  simulator.size(windowWidth, windowHeight - 8);

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  canHeight = 0.75 * (simulator.size().height - 8);

  // Now to create the canvas!!
  canvas = createCanvas(canWidth, canHeight);
  canvas.class('can');
  canvas.parent('sim');

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('sim');
  simulatorInput.size(canWidth, 0.25 * canHeight);

    simulatorInputSub0 = createDiv('');
    simulatorInputSub0.id('simInputSub0');
    simulatorInputSub0.parent('simInput');

    simulatorInputSub1 = createDiv('');
    simulatorInputSub1.id('simInputSub1');
    simulatorInputSub1.parent('simInput');
      simulatorInputSub2 = createDiv('');
      simulatorInputSub2.id('simInputSub2');
      simulatorInputSub2.parent('simInputSub1');
      simulatorInputSub3 = createDiv('');
      simulatorInputSub3.id('simInputSub3');
      simulatorInputSub3.parent('simInputSub1');


    // Div to contain the equation
    equation = createDiv("");
    equation.id('equationdiv');
    equation.parent('simInputSub0');
    equation.size(leftBox.size().width, 0.20 * leftBox.size().height);

    makeNeqMML();

  //Control UI ----------------------------
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInputSub2');
  controlsLeft.size(canWidth / 2, 0.25 * canHeight);

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInputSub2');
  controlsRight.size(canWidth / 2, 0.25 * canHeight);

  control0 = createDiv('');
  control0.class('control');
  control0.parent(controlsLeft);

  control1 = createDiv('');
  control1.class('control');
  control1.parent(controlsLeft);

  control2 = createDiv('');
  control2.class('control');
  control2.parent(controlsLeft);

  control3 = createDiv('');
  control3.class('control');
  control3.parent(controlsRight);

  control4 = createDiv('');
  control4.class('control');
  control4.parent(controlsRight);

  control5 = createDiv('');
  control5.class('control');
  control5.parent(controlsRight);

  particleControl = createDiv('');
  particleControl.id('particleControl');
  particleControl.parent('simInputSub3');
  particleControl.size(canWidth, 0.1 * canHeight);
  simulatorInputSub4 = createDiv('');
  simulatorInputSub4.id('simInputSub4');
  
  simulatorInputSub4.parent('simInputSub0');
}

function makeNeqMML() {
  math = createElement("math");
  math.attribute("xmlns", "http://www.w3.org/1998/Math/MathML");
  math.id('math');
  math.parent('equationdiv');

  mrow0 = createElement("mrow");
  mrow0.id('mrow0');
  mrow0.parent('math');

  msub0 = createElement("msub");
  msub0.id('msub0');
  msub0.parent("mrow0");

  mi0 = createElement("mi", "E");
  mi0.parent("msub0");

  mi1 = createElement("mi", "ion");
  mi1.parent("msub0");

  eqSign = createElement("mo", "=");
  eqSign.parent("math");

  // -------------------------------------

  mrow1 = createElement("mrow");
  mrow1.id("mrow1");
  mrow1.parent("math");

  mfrac0 = createElement("mfrac");
  mfrac0.id("mfrac0");
  mfrac0.parent("mrow1");

  mrow2 = createElement("mrow");
  mrow2.id("mrow2");
  mrow2.parent("mfrac0");

  mi2 = createElement("mi", "R");
  mi2.parent("mrow2");

  mi3 = createElement("mi", "T");
  mi3.parent("mrow2");

  mrow3 = createElement("mrow");
  mrow3.id("mrow3");
  mrow3.parent("mfrac0");

  mi4 = createElement("mi", "z");
  mi4.parent("mrow3");

  mi5 = createElement("mi", "F");
  mi5.parent("mrow3");

  // -----------------------------------------
  mrow4 = createElement("mrow");
  mrow4.id("mrow4");
  mrow4.parent("math");

  mi6 = createElement("mi", "ln");
  mi6.parent("mrow4");

  mfence0 = createElement("mfenced");
  mfence0.id("mfence0");
  mfence0.parent("mrow4");

  mfrac1 = createElement("mfrac");
  mfrac1.id("mfrac1");
  mfrac1.parent("mfence0");

  sem0 = createElement("semantics");
  sem0.id("sem0");
  sem0.parent("mfrac1");

  // anno0 = createElement("annotation-xml");
  // anno0.attribute("encoding", "application/xhtml+xml");
  // anno0.parent("sem0");
  // anno0.id("neq-top");

  anno0 = createElement("mi", "Ion Out");
  anno0.parent("sem0");
  anno0.id("neq-top");

  sem1 = createElement("semantics");
  sem1.id("sem1");
  sem1.parent("mfrac1");

  // anno1 = createElement("annotation-xml");
  // anno1.attribute("encoding", "application/xhtml+xml");
  // anno1.parent("sem1");
  // anno1.id("neq-bot");
  anno1 = createElement("mi", "Ion In");
  anno1.parent("sem1");
  anno1.id("neq-bot");


}
