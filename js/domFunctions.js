
equationContainerHeighthMul = 0.35;

function makeLayout() {
  // Make the entire stage. This represents the entire, outer box containing the simulator, sidebar, and controls.
  stage = createDiv('');
  stage.id('stage');
  stage.class('flex-container');
  // stage.style('background-color',color(0));

  firstBox = createDiv("");
  firstBox.id('firstBox');
  firstBox.parent('stage');

  secondBox = createDiv("");
  secondBox.id('secondBox');
  secondBox.parent('stage');

  // The right sidebar for displaying questions.
  leftBox = createDiv("");
  leftBox.id('leftbar');
  leftBox.parent('firstBox');

    var leftbarStatus = document.getElementById("leftbar");
    leftbarStatus.style.display = "flex";

  // Create the div to actually contain the questions.
  questions = createDiv("");
  questions.id('questionsdiv');
  questions.parent('leftbar');
  questionTitle = createElement("h3", "Goldman-Hodgkin-Katz").parent('questionsdiv');
  questionTitle.id('questionTitle');

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
  equationContainer.parent('firstBox');

  // The right sidebar for displaying questions.
  hideBar = createDiv("");
  hideBar.id('hidebar');
  hideBar.parent('equationContainer');
  hideBar.mousePressed(hideQuestion);

  function hideQuestion(evt) {
    // if (leftbarStatus.style.width != "0px") {
    // if (leftbarStatus.style.display == "flex") {
    if (equationContainerHeighthMul == 0.35) { //Turn the question menu off
        // leftbarStatus.style.width = "0px";
          // leftbarStatus.style.display = "none";
      document.getElementById("hidebarText").innerText = ">"
      document.getElementById('simulatorSetting').style.display = "flex";

      if (simulatorMode == "Nernst") {
      document.getElementById('NernstSetting').style.display = "initial";
      } else {
      document.getElementById('GoldmanSetting').style.display = "initial";
      }
      document.getElementById('helpQuestion').style.display = "none";
      document.getElementById('helpSetting').style.height = "100%";
        redrawUI(false);
    } else { //Turn the question menu on
        // leftbarStatus.style.width = (0.35 * windowWidth);
          // leftbarStatus.style.display = "flex";
      document.getElementById("hidebarText").innerText = "<"
      document.getElementById('simulatorSetting').style.display = "none";

      if (simulatorMode == "Nernst") {
      document.getElementById('NernstSetting').style.display = "none";
      } else {
      document.getElementById('GoldmanSetting').style.display = "none";
      }
      document.getElementById('helpQuestion').style.display = "initial";
      document.getElementById('helpSetting').style.height = "35%";
        redrawUI(true);
    }

  }

  hideBarText = createElement("div", "<");
  hideBarText.id('hidebarText');
  hideBarText.parent("hidebar");

  equation = createDiv("");
  equation.id('equationdiv');
  equation.parent('equationContainer');

    equi = createButton('Equilibrate');
    equi.id('equilibrate-button');
    equi.parent('equationContainer');
    equi.mousePressed(startEquilibrate);


    makeNeqMML();
    makeGoldmanEqn();


    simulatorSetting = createElement("div", "Simulation Setting");
    simulatorSetting.id('simulatorSetting');
    simulatorSetting.parent("equationdiv");
    document.getElementById('simulatorSetting').style.display = "none";

    var previousLength = 0;
    for (var j=0; j<2; j++) {
        var table = createElement('table')

        if (j==0) {
        table.id("NernstSetting");
        table.parent("equationdiv");

      // var content = ["T","z","[X]<sub>out</sub>","[X]<sub>in</sub>"]
      // var contentUnit = ["K","","mM","mM"]
      var content = ["T"]
      var contentUnit = ["K"]
      var contentDefaultValue = [tempSetting,particlesProperties["Na"].charge]

      } else {
      table.id("GoldmanSetting");
      table.parent("equationdiv");

      // var content = ["T","p<sub>k</sub>","p<sub>Na</sub>","p<sub>Cl</sub>","[K<sup>+</sup>]<sub>out</sub>","[K<sup>+</sup>]<sub>in</sub>"
      // ,"[Na<sup>+</sup>]<sub>out</sub>","[Na<sup>+</sup>]<sub>in</sub>","[Cl<sup>-</sup>]<sub>out</sub>","[Cl<sup>-</sup>]<sub>in</sub>"]
      // var contentUnit = ["K","","","","mM","mM","mM","mM","mM","mM"]
      var content = ["T","p<sub>Na</sub>","p<sub>Cl</sub>","p<sub>K</sub>"]
      var contentUnit = ["K","","",""]
      var contentDefaultValue = [tempSetting,particlesProperties["Na"].permeability,particlesProperties["Cl"].permeability,particlesProperties["K"].permeability]

      }
      var tableRow = content.length;
      if (previousLength == 0) {
      var previousLength = content.length;
      }
      document.getElementById(table.id()).style.display = "none";

    for (var i=0; i<tableRow; i++) {

        var trow = createElement('tr');
            trow.parent(table);

                var td0 = createElement('td');
                td0.parent(trow);
                var td1 = createElement('td');
                td1.parent(trow);
    simSettingText = createElement('h4', content[i]);
    simSettingText.parent(td0);

    if(j>0) {
      k = i + previousLength;
    } else {
      k = i;
    }
    simSetting[k] = createInput();
    simSetting[k].parent('equationdiv');
    simSetting[k].value(contentDefaultValue[i])
    simSetting[k].parent(td1);
    simSetting[k].id(k);
    simSetting[k].input(ChangesimulatorSetting);

    var td3 = createElement('td',contentUnit[i]);
    td3.parent(trow);
  }
}
    // input[k].id(k);

  simulator = createDiv("");
  simulator.id('sim');
  simulator.parent('secondBox');
  simulator.size(0.65 * windowWidth, 0.65 *  (windowHeight - 36));

    // pauseButton = createDiv("");
    // pauseButton.id('pauseButton');
    // pauseButton.parent('sim');

  // Define the global canWidth & canHeight variables~
  canWidth = simulator.size().width;
  //canHeight = 0.75 * (simulator.size().height - 8);
  canHeight = 1 * (simulator.size().height - 8);


  simCanvasPause = createElement("div","Paused");
  simCanvasPause.id('simCanvasPause');
  simCanvasPause.parent('sim');
  document.getElementById('simCanvasPause').style.display = "none";

  // Now to create the canvas!!
  canvas = createCanvas(canWidth, canHeight);
  canvas.class('can');
  canvas.parent('sim');

  window.onresize = function() {

    // if (leftbarStatus.style.display == "flex") {
    if (equationContainerHeighthMul == 0.35) {
        redrawUI(true);
    } else {
        redrawUI(false);
    }
  }

  // Div to contain the simulatorInput
  simulatorInputContainer = createDiv("");
  simulatorInputContainer.id('simulatorInputContainer');
  simulatorInputContainer.parent('secondBox');

  simuWidth = 0.65 * windowWidth;

  simulatorInput = createDiv('');
  simulatorInput.id('simInput');
  simulatorInput.parent('simulatorInputContainer');

  //Control UI ----------------------------
  controlsLeft = createDiv('');
  controlsLeft.class('controls');
  controlsLeft.parent('simInput');

  controlsRight = createDiv('');
  controlsRight.class('controls');
  controlsRight.parent('simInput');

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

  adjustUISize(0.35);


//   table questions
//     qtable = createElement("table");
//     qtable.id('qtable');
//     qtable.class('qtable');
//     qtable.parent('q1');
//
//     qtr1 = createElement("tr");
//     qtr1.id("qtr1");
//     qtr1.parent("qtable");
//
//     qth1 = createElement("th", "[Na]out");
//     qth1.id("qth1");
//     qth1.parent("qtr1");
//
//     qth2 = createElement("th", "[Na]in");
//     qth2.id("qth2");
//     qth2.parent("qtr1");
//
//     qth3 = createElement("th", "[K]out");
//     qth3.id("qth3");
//     qth3.parent("qtr1");
//
//     qth4 = createElement("th", "[K]in");
//     qth4.id("qth4");
//     qth4.parent("qtr1");
// //
//     qtr2 = createElement("tr");
//     qtr2.id("qtr2");
//     qtr2.parent("qtable");
//
//     qth5 = createElement("th", "150");
//     qth5.id("qth5");
//     qth5.parent("qtr2");
//
//     qth6 = createElement("th", "15");
//     qth6.id("qth6");
//     qth6.parent("qtr2");
//
//     qth7 = createElement("th", "5");
//     qth7.id("qth7");
//     qth7.parent("qtr2");
//
//     qth8 = createElement("th", "120");
//     qth8.id("qth8");
//     qth8.parent("qtr2");
// //
//     qtr3 = createElement("tr");
//     qtr3.id("qtr3");
//     qtr3.parent("qtable");
//
//     qth9 = createElement("th", "150");
//     qth9.id("qth9");
//     qth9.parent("qtr3");
//
//     qth10 = createElement("th", "15");
//     qth10.id("qth10");
//     qth10.parent("qtr3");
//
//     qth11 = createElement("th", "7.5");
//     qth11.id("qth11");
//     qth11.parent("qtr3");
//
//     qth12 = createElement("th", "120");
//     qth12.id("qth12");
//     qth12.parent("qtr3");
// //
//     qtr4 = createElement("tr");
//     qtr4.id("qtr4");
//     qtr4.parent("qtable");
//
//     qth13 = createElement("th", "150");
//     qth13.id("qth13");
//     qth13.parent("qtr4");
//
//     qth14 = createElement("th", "15");
//     qth14.id("qth14");
//     qth14.parent("qtr4");
//
//     qth15 = createElement("th", "2.5");
//     qth15.id("qth15");
//     qth15.parent("qtr4");
//
//     qth16 = createElement("th", "120");
//     qth16.id("qth16");
//     qth16.parent("qtr4");
//
//       qtext2 = createElement("p", "These changes in [K]out concentration are real examples of pathological conditions that can lead to seizures and renal failure.");
//       qtext2.id('qtext2');
//       qtext2.parent('q1');
//
//     questionText[0] = document.getElementById('q1').innerHTML;
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

function makeGoldmanEqn() {

  // math1 = createElement("math");
  // math1.attribute("xmlns", "http://www.w3.org/1998/Math/MathML");
  // math1.id('math1');
  // math1.parent('equationdiv');
  // mi34 = createElement("mi", "Goldman-Hodgkin-Katz");
  // mi34.parent("math1");

  mathGoldman = createElement("math");
  mathGoldman.attribute("xmlns", "http://www.w3.org/1998/Math/MathML");
  mathGoldman.id('mathGoldman');
  mathGoldman.parent('equationdiv');

  msub0Goldman = createElement("msub");
  msub0Goldman.id('msub0Goldman');
  msub0Goldman.parent('mathGoldman');

  mi0Goldman = createElement("mi", "V");
  mi0Goldman.parent("msub0Goldman");

  mi1Goldman = createElement("mi", "rest");
  mi1Goldman.parent("msub0Goldman");

  eqSignGoldman = createElement("mo", "=");
  eqSignGoldman.parent("mathGoldman");

  // -------------------------------------
  // RT/F
  mrow1Goldman = createElement("mrow");
  mrow1Goldman.id("mrow1Goldman");
  mrow1Goldman.parent("mathGoldman");

  mfrac0Goldman = createElement("mfrac");
  mfrac0Goldman.id("mfrac0Goldman");
  mfrac0Goldman.parent("mrow1Goldman");

  mrow2pGoldman = createElement("mrow");
  mrow2pGoldman.id("mrow2pGoldman");
  mrow2pGoldman.parent("mfrac0Goldman");
  mi2Goldman = createElement("mi", "R");
  mi2Goldman.parent("mrow2pGoldman");
  mi2pGoldman = createElement("mi", "T");
  mi2pGoldman.parent("mrow2pGoldman");

  mrow2Goldman = createElement("mrow");
  mrow2Goldman.id("mrow2Goldman");
  mrow2Goldman.parent("mfrac0Goldman");

  mi3Goldman = createElement("mi", "F");
  mi3Goldman.parent("mrow2Goldman");

  // -------------------------------------
  mi4Goldman = createElement("mi", "ln");
  mi4Goldman.parent("mathGoldman");

  // -------------------------------------
  mrow3Goldman = createElement("mrow");
  mrow3Goldman.id("mrow3Goldman");
  mrow3Goldman.parent("mathGoldman");

  mfrac1Goldman = createElement("mfrac");
  mfrac1Goldman.id("mfrac1Goldman");
  mfrac1Goldman.parent("mrow3Goldman");

  mrow4Goldman = createElement("mrow");
  mrow4Goldman.id("mrow4Goldman");
  mrow4Goldman.parent("mfrac1Goldman");

  // Na+
  msub1Goldman = createElement("msub");
  msub1Goldman.id("msub1Goldman");
  msub1Goldman.parent("mrow4Goldman");

  mi6Goldman= createElement("mi", "P");
  mi6Goldman.parent("msub1Goldman");

  mi7Goldman = createElement("mi", "Na");
  mi7Goldman.parent("msub1Goldman");

  mi8Goldman = createElement("mi", "[N");
  mi8Goldman.parent("mrow4Goldman");

  msup0Goldman = createElement("msup");
  msup0Goldman.id("msup0Goldman");
  msup0Goldman.parent("mrow4Goldman");

  mi9Goldman = createElement("mi", "a");
  mi9Goldman.parent("msup0Goldman");
  mo0Goldman = createElement("mo", "+");
  mo0Goldman.parent("msup0Goldman");

  msub2Goldman = createElement("msub");
  msub2Goldman.id("msub2Goldman");
  msub2Goldman.parent("mrow4Goldman");
  mo1Goldman = createElement("mo", "]");
  mo1Goldman.parent("msub2Goldman");
  mi10Goldman = createElement("mi", "out");
  mi10Goldman.parent("msub2Goldman");


  mo1Goldman = createElement("mo", "+");
  mo1Goldman.parent("mrow4Goldman");
  // -------------------------------------
  //Top

  // Cl

  msub3Goldman = createElement("msub");
  msub3Goldman.id("msub3Goldman");
  msub3Goldman.parent("mrow4Goldman");

  mi11Goldman= createElement("mi", "P");
  mi11Goldman.parent("msub3Goldman");

  mi12Goldman = createElement("mi", "Cl");
  mi12Goldman.parent("msub3Goldman");

  mi13Goldman = createElement("mi", "[C");
  mi13Goldman.parent("mrow4Goldman");

  msup1Goldman = createElement("msup");
  msup1Goldman.id("msup1Goldman");
  msup1Goldman.parent("mrow4Goldman");

  mi14Goldman = createElement("mi", "l");
  mi14Goldman.parent("msup1Goldman");
  mo2Goldman = createElement("mo", "-");
  mo2Goldman.parent("msup1Goldman");

  msub4Goldman = createElement("msub");
  msub4Goldman.id("msub4Goldman");
  msub4Goldman.parent("mrow4Goldman");
  mo3Goldman = createElement("mo", "]");
  mo3Goldman.parent("msub4Goldman");
  mi14Goldman = createElement("mi", "in");
  mi14Goldman.parent("msub4Goldman");

  mo2Goldman = createElement("mo", "+");
  mo2Goldman.parent("mrow4Goldman");

  // K

  msub5Goldman = createElement("msub");
  msub5Goldman.id("msub5Goldman");
  msub5Goldman.parent("mrow4Goldman");

  mi15Goldman= createElement("mi", "P");
  mi15Goldman.parent("msub5Goldman");

  mi16Goldman = createElement("mi", "K");
  mi16Goldman.parent("msub5Goldman");

  mo3Goldman = createElement("mo", "[");
  mo3Goldman.parent("mrow4Goldman");

  msup2 = createElement("msup");
  msup2.id("msup2Goldman");
  msup2.parent("mrow4Goldman");

  mi18Goldman = createElement("mi", "K");
  mi18Goldman.parent("msup2Goldman");
  mo3Goldman = createElement("mo", "-");
  mo3Goldman.parent("msup2Goldman");

  msub6Goldman = createElement("msub");
  msub6Goldman.id("msub6Goldman");
  msub6Goldman.parent("mrow4Goldman");
  mo4Goldman = createElement("mo", "]");
  mo4Goldman.parent("msub6Goldman");
  mi19Goldman = createElement("mi", "out");
  mi19Goldman.parent("msub6Goldman");

  // -------------------------------------
  //Bottom

    mrow5Goldman = createElement("mrow");
    mrow5Goldman.id("mrow5Goldman");
    mrow5Goldman.parent("mfrac1Goldman");


    // Na+
    msub7Goldman = createElement("msub");
    msub7Goldman.id("msub7Goldman");
    msub7Goldman.parent("mrow5Goldman");

    mi20Goldman= createElement("mi", "P");
    mi20Goldman.parent("msub7Goldman");

    mi21Goldman = createElement("mi", "Na");
    mi21Goldman.parent("msub7Goldman");

    mi22Goldman = createElement("mi", "[N");
    mi22Goldman.parent("mrow5Goldman");

    msup3Goldman = createElement("msup");
    msup3Goldman.id("msup3Goldman");
    msup3Goldman.parent("mrow5Goldman");

    mi23Goldman = createElement("mi", "a");
    mi23Goldman.parent("msup3Goldman");
    mo5Goldman = createElement("mo", "+");
    mo5Goldman.parent("msup3Goldman");

    msub8 = createElement("msub");
    msub8.id("msub8Goldman");
    msub8.parent("mrow5Goldman");
    mo6Goldman = createElement("mo", "]");
    mo6Goldman.parent("msub8Goldman");
    mi24Goldman = createElement("mi", "in");
    mi24Goldman.parent("msub8Goldman");

    mo7Goldman = createElement("mo", "+");
    mo7Goldman.parent("mrow5Goldman");

    // Cl

    msub9Goldman = createElement("msub");
    msub9Goldman.id("msub9Goldman");
    msub9Goldman.parent("mrow5Goldman");

    mi25Goldman= createElement("mi", "P");
    mi25Goldman.parent("msub9Goldman");

    mi26Goldman = createElement("mi", "Cl");
    mi26Goldman.parent("msub9Goldman");

    mi27Goldman = createElement("mi", "[C");
    mi27Goldman.parent("mrow5Goldman");

    msup4Goldman = createElement("msup");
    msup4Goldman.id("msup4Goldman");
    msup4Goldman.parent("mrow5Goldman");

    mi28Goldman = createElement("mi", "l");
    mi28Goldman.parent("msup4Goldman");
    mo8Goldman = createElement("mo", "-");
    mo8Goldman.parent("msup4Goldman");

    msub10Goldman = createElement("msub");
    msub10Goldman.id("msub10Goldman");
    msub10Goldman.parent("mrow5Goldman");

    mo9Goldman = createElement("mo", "]");
    mo9Goldman.parent("msub10Goldman");
    mi29Goldman = createElement("mi", "out");
    mi29Goldman.parent("msub10Goldman");

    mo7Goldman = createElement("mo", "+");
    mo7Goldman.parent("mrow5Goldman");


    // K

    msub11Goldman = createElement("msub");
    msub11Goldman.id("msub11Goldman");
    msub11Goldman.parent("mrow5Goldman");

    mi30Goldman= createElement("mi", "P");
    mi30Goldman.parent("msub11Goldman");

    mi31Goldman = createElement("mi", "K");
    mi31Goldman.parent("msub11Goldman");

    mo8Goldman = createElement("mo", "[");
    mo8Goldman.parent("mrow5Goldman");

    msup5Goldman = createElement("msup");
    msup5Goldman.id("msup5Goldman");
    msup5Goldman.parent("mrow5Goldman");

    mi32Goldman = createElement("mi", "K");
    mi32Goldman.parent("msup5Goldman");
    mo9Goldman = createElement("mo", "-");
    mo9Goldman.parent("msup5Goldman");

    msub12Goldman = createElement("msub");
    msub12Goldman.id("msub12Goldman");
    msub12Goldman.parent("mrow5Goldman");
    mo10Goldman = createElement("mo", "]");
    mo10Goldman.parent("msub12Goldman");
    mi33Goldman = createElement("mi", "in");
    mi33Goldman.parent("msub12Goldman");
}

function redrawUI(questionBox) {


    if(questionBox == true) {
    equationContainerHeighthMul = 0.35;
  } else {
  equationContainerHeighthMul = 1;
  }

      adjustUISize(equationContainerHeighthMul);
      canvas.size(canWidth, canHeight);

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

function adjustUISize(multiple) {

        simuWidth = 0.65 * windowWidth;
  stage.size(windowWidth, (windowHeight - 36));
  firstBox.size(0.35 * windowWidth, (windowHeight - 36));
  secondBox.size(0.65 * windowWidth, (windowHeight - 36));
  questions.size(0.35 * windowWidth, (1 - multiple) *  (windowHeight - 36));

  equationContainer.size(0.35 * windowWidth, multiple * (windowHeight - 36));
  leftBox.size(0.35 * windowWidth, (1 - multiple) * (windowHeight - 36));
  hideBar.size(0.35 * windowWidth, 20);
  equi.size(0.35 * windowWidth, 40);
  equation.size(0.35 * windowWidth, multiple * (windowHeight - 36) - 40 - 20);
  simulator.size(0.65 * windowWidth, 0.65 *  (windowHeight - 36));
          // Define the global canWidth & canHeight variables~
          canWidth = simulator.size().width;
          //canHeight = 0.75 * (simulator.size().height - 8);
          canHeight = 1 * (simulator.size().height - 4);

  simulatorInputContainer.size(0.65 * windowWidth, 0.35 * (windowHeight - 36));
  simulatorInput.size(simuWidth, 0.35 * 0.90 * (windowHeight - 36));
  controlsLeft.size(simuWidth / 2, 0.35 * canHeight);
  controlsRight.size(simuWidth / 2, 0.35 * canHeight);
  particleControl.size(simuWidth, 0.1 * 0.80 * (windowHeight - 36));
  canvas.size(canWidth, canHeight);
}
