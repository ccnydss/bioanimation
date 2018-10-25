// QUnit References:
// https://qunitjs.com/cookbook/
// https://api.qunitjs.com/


QUnit.module("Point Tests");

QUnit.test("constructor", function(assert) {
  var p1 = new Point(5, 3);
  assert.equal(p1.x, 5, "p1 x coord = 5");
  assert.equal(p1.y, 3, "p1 y coord = 3");

  var p2 = new Point(0, 0);
  assert.equal(p2.x, p2.y, "p2 coords are equal");
  assert.equal(p2.x, 0, "p2 coord = 0");

  var p3 = new Point(-2, -6);
  assert.equal(p3.x, -2, "p3 x coord = -2");
  assert.equal(p3.y, -6, "p3 y coord = -6");
});

// =============================================================================
QUnit.module("Channel Tests");

QUnit.test("constructor", function(assert) {
  var topleft = new Point(0, 0);
  var topright = new Point(10, 0);
  var botleft = new Point(0, 10);
  var botright = new Point(10, 10);

  var testCh1 = new Channel(topleft, topright, botright, botleft, "Na");

  assert.deepEqual(testCh1.tl, topleft, "Top Left Point is correct");
  assert.deepEqual(testCh1.tr, topright, "Top Right Point is correct");
  assert.deepEqual(testCh1.br, botright, "Bottom Right Point is correct");
  assert.deepEqual(testCh1.bl, botleft, "Bottom Left Point is correct");
});

QUnit.test("isInTransferRange", function(assert) {
  assert.ok(1, "Pass");
});

QUnit.test("transfers", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
QUnit.module("Container Tests");

QUnit.test("moveNoCollision", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
QUnit.module("Particle Tests");

QUnit.test("move", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
QUnit.module("domFunctions");

QUnit.test("make layout", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
QUnit.module("sketchControls");

QUnit.test("transferParticle", function(assert) {
  assert.ok(1, "Pass");
});