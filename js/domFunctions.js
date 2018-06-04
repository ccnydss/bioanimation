function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  stage = createDiv('');
  stage.id('stage');
  stage.class('flex-container');
  stage.size(windowWidth, windowHeight);
  // stage.style('background-color',color(0));

  topBox = createDiv("");
  topBox.id('topBox');
  topBox.parent('stage');
  topBox.size(windowWidth, 0.75 *  windowHeight);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)

  botBox = createDiv("");
  botBox.id('botBox');
  botBox.parent('stage');
  botBox.size(windowWidth, 0.25 *  windowHeight);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)


  // The right sidebar for displaying questions.
  leftBox = createDiv("");
  leftBox.id('leftbar');
  leftBox.parent('topBox');
  leftBox.size(0.35 * windowWidth, 0.75 *  windowHeight - 8);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)

    var leftbarStatus = document.getElementById("leftbar");
    leftbarStatus.style.display = "flex";


  // The right sidebar for displaying questions.
  hideBar = createDiv("");
  hideBar.id('hidebar');
  hideBar.parent('topBox');
  hideBar.mousePressed(hideQuestion);

  function hideQuestion(evt) {
    if (leftbarStatus.style.display == "flex") {
      leftbarStatus.style.display = "none";
      document.getElementById("hidebarText").innerText = ">"
        redrawUI(false);
    } else {
      leftbarStatus.style.display = "flex";
      document.getElementById("hidebarText").innerText = "<"
        redrawUI(true);
    }

  }

  hideBarText = createElement("div", "<");
  hideBarText.id('hidebarText');
  hideBarText.parent("hidebar");

  // Create the div to actually contain the questions.
  questions = createDiv("");
  questions.id('questionsdiv');
  questions.parent('leftbar');
  questions.size(0.35 * windowWidth - 20, 0.75 *  windowHeight);
  createElement("h3", "Goldman-Hodgkin-Katz").parent('questionsdiv');

  var questionsText
  questionsText = "Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions"
    var question = createElement("p",questionsText).parent('questionsdiv');
    question.class("questions");
    question.id("q1");
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


    // questionBotton = createDiv("");
    // questionBotton.id('questionBotton');
    // questionBotton.class('questionButton');
    // questionBotton.parent('questionsdiv');
    //
    // questionNext = createButton('Previous');
    // questionNext.id('questionPrev');
    // questionNext.parent('questionBotton');
    // questionNext.size(leftBox.size().width, 0.075 * leftBox.size().height);
    // questionNext.mousePressed(quesPrev);
    // document.getElementById("questionPrev").style.display= "none";
    //
    // questionPrev = createButton('Next');
    // questionPrev.id('questionNext');
    // questionPrev.parent('questionBotton');
    // questionPrev.size(leftBox.size().width, 0.075 * leftBox.size().height);
    // questionPrev.mousePressed(quesNext);
    //
    //
    // function quesNext(evt) {
    //   if (q>=qmax-1) {
    //     //alert(q+" "+qmax)
    //     document.getElementById("questionNext").style.display= "none";
    //     q = qmax;
    //   } else {
    //   q = q+1;
    //       document.getElementById("questionPrev").style.display= "";
    //     }
    //       document.getElementById("q1").innerHTML = questions[q];
    // }
    //
    // function quesPrev(evt) {
    //   if (q<=1) {
    //     document.getElementById("questionPrev").style.display= "none";
    //     q = 0;
    //   } else {
    //   q = q-1;
    //       document.getElementById("questionNext").style.display= "";
    //     }
    //       document.getElementById("q1").innerHTML = questions[q];
    // }


  // Div to contain the equation
  equationContainer = createDiv("");
  equationContainer.id('equationContainer');
  equationContainer.parent('botBox');
  equationContainer.size(0.35 * windowWidth, 0.25 * windowHeight);

  equation = createDiv("");
  equation.id('equationdiv');
  equation.parent('equationContainer');
  equation.size(0.35 * windowWidth, 0.25 * windowHeight - 36);

  makeNeqMML();

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('topBox');
  simulator.size(0.75 * windowWidth, 0.75 *  windowHeight);

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  //canHeight = 0.75 * (simulator.size().height - 8);
  canHeight = 1 * (simulator.size().height - 8);

  // Now to create the canvas!!
  canvas = createCanvas(canWidth, canHeight);
  canvas.class('can');
  canvas.parent('sim');

  window.onresize = function() {

    if (leftbarStatus.style.display == "flex") {
        redrawUI(true);
    } else {
        redrawUI(false);
    }
  }

  // Div to contain the simulatorInput
  simulatorInputContainer = createDiv("");
  simulatorInputContainer.id('simulatorInputContainer');
  simulatorInputContainer.parent('botBox');
  simulatorInputContainer.size(0.75 * windowWidth, 0.25 * windowHeight);

  simuWidth = 0.75 * windowWidth;

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('simulatorInputContainer');
  simulatorInput.size(simuWidth, 0.25 * canHeight);

  //Control UI ----------------------------
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInput');
  controlsLeft.size(simuWidth / 2, 0.25 * canHeight);

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInput');
  controlsRight.size(simuWidth / 2, 0.25 * canHeight);

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
  particleControl.parent('simulatorInputContainer');
  particleControl.size(simuWidth, 0.1 * canHeight);

//   table questions
    qtable = createElement("table");
    qtable.id('qtable');
    qtable.class('qtable');
    qtable.parent('q1');

    qtr1 = createElement("tr");
    qtr1.id("qtr1");
    qtr1.parent("qtable");

    qth1 = createElement("th", "[Na]out");
    qth1.id("qth1");
    qth1.parent("qtr1");

    qth2 = createElement("th", "[Na]in");
    qth2.id("qth2");
    qth2.parent("qtr1");

    qth3 = createElement("th", "[K]out");
    qth3.id("qth3");
    qth3.parent("qtr1");

    qth4 = createElement("th", "[K]in");
    qth4.id("qth4");
    qth4.parent("qtr1");
//
    qtr2 = createElement("tr");
    qtr2.id("qtr2");
    qtr2.parent("qtable");

    qth5 = createElement("th", "150");
    qth5.id("qth5");
    qth5.parent("qtr2");

    qth6 = createElement("th", "15");
    qth6.id("qth6");
    qth6.parent("qtr2");

    qth7 = createElement("th", "5");
    qth7.id("qth7");
    qth7.parent("qtr2");

    qth8 = createElement("th", "120");
    qth8.id("qth8");
    qth8.parent("qtr2");
//
    qtr3 = createElement("tr");
    qtr3.id("qtr3");
    qtr3.parent("qtable");

    qth9 = createElement("th", "150");
    qth9.id("qth9");
    qth9.parent("qtr3");

    qth10 = createElement("th", "15");
    qth10.id("qth10");
    qth10.parent("qtr3");

    qth11 = createElement("th", "7.5");
    qth11.id("qth11");
    qth11.parent("qtr3");

    qth12 = createElement("th", "120");
    qth12.id("qth12");
    qth12.parent("qtr3");
//
    qtr4 = createElement("tr");
    qtr4.id("qtr4");
    qtr4.parent("qtable");

    qth13 = createElement("th", "150");
    qth13.id("qth13");
    qth13.parent("qtr4");

    qth14 = createElement("th", "15");
    qth14.id("qth14");
    qth14.parent("qtr4");

    qth15 = createElement("th", "2.5");
    qth15.id("qth15");
    qth15.parent("qtr4");

    qth16 = createElement("th", "120");
    qth16.id("qth16");
    qth16.parent("qtr4");

      qtext2 = createElement("p", "These changes in [K]out concentration are real examples of pathological conditions that can lead to seizures and renal failure.");
      qtext2.id('qtext2');
      qtext2.parent('q1');
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

  anno0 = createElement("mi", "Ion Out");
  anno0.parent("sem0");
  anno0.id("neq-top");

  sem1 = createElement("semantics");
  sem1.id("sem1");
  sem1.parent("mfrac1");

  anno1 = createElement("mi", "Ion In");
  anno1.parent("sem1");
  anno1.id("neq-bot");

}

var simulatorWidthMul = 0.65;
function redrawUI(questionBox) {

simulatorWidthMul = 1;

  stage.size(windowWidth, windowHeight);
    if(questionBox == true) {
    leftBox.size(0.35 * windowWidth, 0.75 *  windowHeight - 8);  // subtract stage 4px border from top and bottom to remove scrollbars in the parent iframe. (so, 8px total)
    questions.size(0.35 * windowWidth, 0.75 *  windowHeight);
    simulatorWidthMul = 0.65;
    }

    topBox.size(windowWidth, 0.75 *  windowHeight);
    botBox.size(windowWidth, 0.25 *  windowHeight);

    equationContainer.size(0.35 * windowWidth, 0.25 * windowHeight);
    simulatorInputContainer.size(simulatorWidthMul * windowWidth, 0.25 * windowHeight);


    simulator.size(simulatorWidthMul * windowWidth, 0.75 *  windowHeight);

      if(questionBox == false) {
    simulator.size(simulatorWidthMul * windowWidth, 0.75 *  windowHeight);
      }

    canWidth = simulatorWidthMul * windowWidth - 20; //20 is the new offset for collision
    canHeight = 1 * (simulator.size().height - 8);

      simuWidth = 0.75 * windowWidth;
    canvas.size(canWidth, canHeight);
    simulatorInput.size(simuWidth, 0.25 * canHeight);
    particleControl.size(simuWidth, 0.1 * canHeight);
    controlsRight.size(simuWidth / 2, 0.25 * canHeight);
    controlsLeft.size(simuWidth / 2, 0.25 * canHeight);
    equation.size(0.35 * windowWidth, 0.25 * windowHeight - 36);

    var topLeft = new Point( 0, 0 );
    var topRight = new Point( canWidth, 0 );
    var botRight = new Point( canWidth, canHeight/2-thickness );
    var botLeft = new Point( 0, ( canHeight/2-thickness ) );

    //Relative to parent coordinate

    containers["outside"] = new Container(topLeft, topRight, botRight, botLeft, containerProperties["outside"]["color"],"outside");
    containers["outside"].draw();


    var topLeft = new Point( 0, 0 );
    var topRight = new Point( canWidth, 0 );
    var botRight = new Point( canWidth, canHeight/2 );
    var botLeft = new Point( 0, canHeight/2 );
    UIBoxs[0] = new UIBox( topLeft, topRight, botRight, botLeft );
    UIBoxs[0].draw();

    var topLeft = new Point( 0, canHeight/2+thickness );
    var topRight = new Point( canWidth, canHeight/2+thickness );
    var botRight = new Point( canWidth, canHeight );
    var botLeft = new Point( 0, canHeight );

    containers["inside"] = new Container(topLeft, topRight, botRight, botLeft, containerProperties["inside"]["color"],"inside");
    //containers["inside"].draw();

    var topLeft = new Point( 0, canHeight/2 );
    var topRight = new Point( canWidth, canHeight/2 );
    var botRight = new Point( canWidth, canHeight );
    var botLeft = new Point( 0, canHeight );
    UIBoxs[1] = new UIBox( topLeft, topRight, botRight, botLeft );
    UIBoxs[1].draw();
    containers["inside"].draw();

        makeUIs(false)
}
