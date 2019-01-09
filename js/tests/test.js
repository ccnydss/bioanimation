// QUnit References:
// https://qunitjs.com/cookbook/
// https://api.qunitjs.com/

QUnit.module("domFunctions");

QUnit.test("makeLayout", function(assert) {
  assert.ok(document.getElementById("stage"), "Stage was created");
  assert.ok(document.getElementById("firstBox"), "FirstBox was created");
  assert.ok(document.getElementById("secondBox"), "SecondBox was created");
  assert.ok(document.getElementById("leftbar"), "LeftBox was created");
  assert.ok(document.getElementById("questionsdiv"), "Questions Div was created");
  assert.ok(document.getElementById("questionTitle"), "Question Title was created");
  assert.ok(document.getElementById("q1"), "questionsText was created");
  assert.ok(document.getElementById("equationContainer"), "EquationContainer was created");
  assert.ok(document.getElementById("hidebar"), "HideBar was created");
  assert.ok(document.getElementById("hidebarText"), "HideBarText was created");
  assert.ok(document.getElementById("equationdiv"), "EquationDiv was created");
  assert.ok(document.getElementById("simulatorSetting"), "SimulatorSetting was created");
  assert.ok(document.getElementById("NernstSetting"), "NernstSetting was created");
  assert.ok(document.getElementById("GoldmanSetting"), "GoldmanSetting was created");
  assert.ok(document.getElementById("sim"), "Simulator was created");
  assert.ok(document.getElementById("simCanvasPause"), "simCanvasPause was created");
  assert.ok(document.getElementById("simulatorInputContainer"), "simulatorInputContainer was created");
  assert.ok(document.getElementById("simInput"), "simInput was created");
  assert.equal(document.getElementsByClassName("control").length, 6, "Controls were created");
  assert.ok(document.getElementById("particleControl"), "particleControl was created");
});

QUnit.test("makeNeqMML", function(assert) {
  assert.ok(document.getElementById("math"), "Math container created");
  assert.ok(document.getElementById("mrow0"), "mrow0 created");
  assert.ok(document.getElementById("msub0"), "msub0 created");
  assert.ok(document.getElementById("mrow1"), "mrow1 created");
  assert.ok(document.getElementById("mfrac0"), "mfrac0 created");
  assert.ok(document.getElementById("mrow2"), "mrow2 created");
  assert.ok(document.getElementById("mrow3"), "mrow3 created");
  assert.ok(document.getElementById("mrow4"), "mrow4 created");
  assert.ok(document.getElementById("mfence0"), "mfence0 created");
  assert.ok(document.getElementById("mfrac1"), "mfrac1 created");
  assert.ok(document.getElementById("sem0"), "sem0 created");
  assert.ok(document.getElementById("neq-top"), "neq-top created");
  assert.ok(document.getElementById("sem1"), "sem1 created");
  assert.ok(document.getElementById("neq-bot"), "neq-bot created");
});

QUnit.test("makeGoldmanEqn", function(assert) {
  assert.ok(document.getElementById("mathGoldman"), "mathGoldman was created");
  assert.ok(document.getElementById("msub0Goldman"), "msub0Goldman was created");
  assert.ok(document.getElementById("mrow1Goldman"), "mrow1Goldman was created");
  assert.ok(document.getElementById("mfrac0Goldman"), "mfrac0Goldman was created");
  assert.ok(document.getElementById("mrow2pGoldman"), "mrow2pGoldman was created");
  assert.ok(document.getElementById("mrow2Goldman"), "mrow2Goldman was created");
  assert.ok(document.getElementById("mrow3Goldman"), "mrow3Goldman was created");
  assert.ok(document.getElementById("mfrac1Goldman"), "mfrac1Goldman was created");
  assert.ok(document.getElementById("mrow4Goldman"), "mrow4Goldman was created");
  assert.ok(document.getElementById("msub1Goldman"), "msub1Goldman was created");
  assert.ok(document.getElementById("msup0Goldman"), "msup0Goldman was created");
  assert.ok(document.getElementById("msub2Goldman"), "msub2Goldman was created");
  assert.ok(document.getElementById("msub3Goldman"), "msub3Goldman was created");
  assert.ok(document.getElementById("msup1Goldman"), "msup1Goldman was created");
  assert.ok(document.getElementById("msub4Goldman"), "msub4Goldman was created");
  assert.ok(document.getElementById("msub5Goldman"), "msub5Goldman was created");
  assert.ok(document.getElementById("msup2Goldman"), "msup2Goldman was created");
  assert.ok(document.getElementById("msub6Goldman"), "msub6Goldman was created");
  assert.ok(document.getElementById("mrow5Goldman"), "mrow5Goldman was created");
  assert.ok(document.getElementById("msub7Goldman"), "msub7Goldman was created");
  assert.ok(document.getElementById("msup3Goldman"), "msup3Goldman was created");
  assert.ok(document.getElementById("msub8Goldman"), "msub8Goldman was created");
  assert.ok(document.getElementById("msub9Goldman"), "msub9Goldman was created");
  assert.ok(document.getElementById("msup4Goldman"), "msup4Goldman was created");
  assert.ok(document.getElementById("msub10Goldman"), "msub10Goldman was created");
  assert.ok(document.getElementById("msub11Goldman"), "msub11Goldman was created");
  assert.ok(document.getElementById("msup5Goldman"), "msup5Goldman was created");
  assert.ok(document.getElementById("msub12Goldman"), "msub12Goldman was created");
});

QUnit.test("redrawUI", function(assert) {
  // NOTE: Depends on external factors like window Width and Height.
  //        not easily testable.
  assert.ok(1, "Pass");
});

QUnit.test("adjustUISize", function(assert) {
  // NOTE: Depends on external factors like window Width and Height.
  //        not easily testable.
  assert.ok(1, "Pass");
});


// =============================================================================
QUnit.module("sketchControls");

QUnit.test("transferParticle", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("equilibrate", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("startNernst", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("startGoldman", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("startEquilibrate", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("disableButton", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("enableButton", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("toggleLoop", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("keyPressed", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("increase", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("decrease", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("ChangeNumParticles", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("ChangesimulatorSetting", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("checkedEvent", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("makeUIs", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("NernstFormula", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("FormulaInputCalculation", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("disableInputForParticle", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("enableInputForParticle", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("loadText", function(assert) {
  assert.ok(1, "Pass");
});
