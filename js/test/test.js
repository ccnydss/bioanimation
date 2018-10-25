// QUnit References:
// https://qunitjs.com/cookbook/
// https://api.qunitjs.com/

QUnit.module("Point Tests");

QUnit.test("constructor", function(assert) {
  var p1 = new Point(5, 3);
  var p2 = new Point(0, 0);
  var p3 = new Point(-2, -6);

  assert.ok(p1, "p1 created successfully");
  assert.ok(p2, "p2 created successfully");
  assert.ok(p3, "p3 created successfully");

  assert.equal(p3.x, -2, "p3 x coord = -2");
  assert.equal(p3.y, -6, "p3 y coord = -6");
});

// =============================================================================
QUnit.module("Particle Tests");

QUnit.test("constructor", function(assert) {
  var p1 = new Particle(10, 25, 20, {x: 10, y: 5}, true);
  assert.ok(p1, "p1 created successfully");

  var p2 = new Particle(10, 25, -20, {x: 10, y: 5}, true);
  assert.ok(p2, "p2 created successfully");
});

QUnit.test("move", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
var topleft_test = new Point(0, 0);
var topright_test = new Point(10, 0);
var botleft_test = new Point(0, 10);
var botright_test = new Point(10, 10);

QUnit.module("Channel Tests");

QUnit.test("constructor", function(assert) {
  var testCh1 = new Channel(topleft_test, topright_test, botright_test, botleft_test, "Na");

  assert.deepEqual(testCh1.tl, topleft_test, "Top Left Point is correct");
  assert.deepEqual(testCh1.tr, topright_test, "Top Right Point is correct");
  assert.deepEqual(testCh1.br, botright_test, "Bottom Right Point is correct");
  assert.deepEqual(testCh1.bl, botleft_test, "Bottom Left Point is correct");
});

QUnit.test("createChannels", function(assert) {

  // NOTE: In the future, we may wish to test the content of chans as well.
  var chans = createChannels(topleft_test, topright_test, botleft_test, botright_test, 3);
  assert.deepEqual(chans.length, 3, "Array length is correct");
});

// =============================================================================
QUnit.module("Container Tests");

QUnit.test("constructor", function(assert) {
  var cont1 = new Container(topleft_test, topright_test, botleft_test, botright_test, "ffeedd", "inside");
  assert.ok(cont1, "Object created");
});

QUnit.test("moveNoCollision", function(assert) {
  var test_particle =  new Particle(12, 15, 3, {x: 1, y: 1}, true);
  var test_cont = new Container(topleft_test, topright_test, botleft_test, botright_test, "ffeedd", "inside");

  test_cont.moveNoCollision(test_particle);
  assert.deepEqual(test_particle.x, 13, "X coordinate has changed");
  assert.deepEqual(test_particle.y, 16, "Y coordinate has changed");
});

// =============================================================================
QUnit.module("sketchControls");

QUnit.test("transferParticle", function(assert) {
  assert.ok(1, "Pass");
});

// =============================================================================
QUnit.module("domFunctions");

QUnit.test("make layout", function(assert) {
  assert.ok(1, "Pass");
});
