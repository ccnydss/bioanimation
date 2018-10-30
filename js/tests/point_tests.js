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
