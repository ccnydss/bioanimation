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
