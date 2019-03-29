const ERROR_MARGIN = 0.0000000000001;

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
    20,
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
    20,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );

  assert.equal(p1.color(), "#ffaa00");
  assert.equal(p1.color("#ff0000"), "#ff0000");
  assert.equal(p1.color(), "#ff0000");
});

QUnit.test("nearToPoint", function(assert) {
  var point = new Point(10, 25);
  var point2 = new Point(50, 50);

  var p1 = new Particle (
    point,
    20,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );

  assert.equal(p1.nearToPoint(point), true);
  assert.equal(p1.nearToPoint(point, 10), true);
  assert.equal(p1.nearToPoint(point2, 10), false);
});

QUnit.test("setVelocity", function(assert) {
  var p1 = new Particle (
    new Point(10, 25),
    20,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );

  var vect = createVector(0, 5);
  var vect2 = createVector(2, 68);

  p1.setVelocity(vect);
  assert.equal(p1.velocity, vect);

  p1.setVelocity(vect2);
  assert.equal(abs(p1.velocity.mag() - p1.speed) <= ERROR_MARGIN, true);
});

QUnit.test("setSpeed", function(assert) {
  var p1 = new Particle (
    new Point(10, 25),
    20,
    { x: 10, y: 5 },
    true,
    "#ffaa00",
    true
  );

  p1.setSpeed(7);
  assert.equal(p1.speed, 7);
  assert.equal(Math.abs(p1.velocity.mag() - 7) <= ERROR_MARGIN, true);
});

QUnit.test("setDisplay", function(assert) {
  var na_p1 = new Na (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );
  na_p1.setDisplay(false);

  assert.equal(na_p1.display, false);
  assert.equal(Na.display, na_p1.display);
});

// /* Not very testable, because it generates random results */
// QUnit.test("randomDirection", function(assert) {
//   assert.ok(1, "Pass");
// });

// /* Not very testable, because it just calls draw() method */
// QUnit.test("move", function(assert) {
//   assert.ok(1, "Pass");
// });

QUnit.test("moveCenter", function(assert) {
  var p1 = new Particle (
    new Point(10, 25),
    20,
    { x: 3, y: 4 },
    true,
    "#ffaa00",
    true
  );

  p1.moveCenter();

  assert.equal(p1.center.x, 10 + 3);
  assert.equal(p1.center.y, 25 + 4);
});

QUnit.test("bounce", function(assert) {
  // Want to make sure that the particle actually does a bounce in a
  // situation where it should.
  assert.ok(1, "Pass");
});

QUnit.test("checkOutOfBounds", function(assert) {
  // Test it when particle is completely inside
  // Test it when particle is completely outside
  // Test it when particle is partially inside
  // Test it when particle edge perfectly touches the container border
  assert.ok(1, "Pass");
});

// /* Can't test because has random side effects  */
// QUnit.test("computeNewDirection", function(assert) {
//   assert.ok(1, "Pass");
// });

QUnit.test("nextPastBottom", function(assert) {
  var p1 = new Particle (
    new Point(50, 50),
    10,
    { x: 0, y: 5 },
    true,
    "#ffaa00",
    true
  );

  var rect = {
    _tl: new Point(0, 0),
    _tr: new Point(100, 0),
    _bl: new Point(0, 100),
    _br: new Point(100, 100)
  };

  var c1 = new Container (
    rect,
    "#ffaa00",
    "inside"
  );

  // Test it when particle is completely inside border
  assert.equal(p1.nextPastBottom(c1.bl), false);

  // Test it when particle is partially past border
  p1.center = new Point (100, 98);
  assert.equal(p1.nextPastBottom(c1.bl), true);

  // Test it when particle edge moves perfectly touches border
  p1.center = new Point (100, 90);
  assert.equal(p1.nextPastBottom(c1.bl), false);
});

QUnit.test("nextPastTop", function(assert) {
  // Test it when particle is completely past border
  // Test it when particle is completely inside border
  // Test it when particle moves partially on border
  // Test it when particle edge moves perfectly touches border

  assert.ok(1, "Pass");
});

QUnit.test("nextPastRight", function(assert) {
  // Test it when particle is completely past border
  // Test it when particle is completely inside border
  // Test it when particle moves partially on border
  // Test it when particle edge moves perfectly touches border

  assert.ok(1, "Pass");
});

QUnit.test("nextPastLeft", function(assert) {
  // Test it when particle is completely past border
  // Test it when particle is completely inside border
  // Test it when particle moves partially on border
  // Test it when particle edge moves perfectly touches border

  assert.ok(1, "Pass");
});
