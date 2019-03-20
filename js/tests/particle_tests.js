QUnit.module("Particle Tests");

QUnit.test("constructor", function(assert) {
  var p1 = new Particle (
    new Point(10, 5),
    10,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );
  assert.ok(p1, "p1 created successfully");

  var p2 = new Particle (
    new Point(10, 25),
    -20,
    { x: 10, y: 5 },
    true,
    "#aaffaa",
    true
  );
  assert.ok(p2, "p2 created successfully");
});

QUnit.test("color", function(assert) {
  var p1 = new Particle (
    new Point(10, 25),
    -20,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );

  assert.equal(p1.color(), "#ffaa00");
  assert.equal(p1.color("#ff0000"), "#ff0000");
})

QUnit.test("move", function(assert) {
  assert.ok(1, "Pass");
});
