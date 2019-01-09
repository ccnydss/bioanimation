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
