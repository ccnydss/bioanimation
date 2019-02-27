QUnit.module("Rectangle Tests");

QUnit.test("constructor", function(assert) {
  var p1 = new Point(5, 3);
  var p2 = new Point(0, 0);
  var p3 = new Point(-2, -6);
  var p4 = new Point(1, 2);

  var p5 = new Point(5, 0);
  var p6 = new Point(0, 3);

  var group1 = {
    _tl: p1,
    _tr: p2,
    _br: p3,
    _bl: p4
  };

  assert.throws(function() {
    var rect1 = new Rectangle (group1, "#550000", "#005500");
  }, "rect1 should throw error because it is not a valid rectangle");

  var group2 = {
    _tl: p2,
    _tr: p5,
    _br: p1,
    _bl: p6
  }

  var rect2 = new Rectangle (group2, "#550000", "#000055");
  assert.ok(rect2, "rect2 created successfully");
});

QUnit.test("fromDimensions", function(assert) {
  var p1 = new Point(2, 4);
  var rect3 = Rectangle.fromDimensions(p1, 10, 5, "#338833");

  assert.ok(rect3, "rect3 created successfully");

  assert.throws(function() {
    var rect4 = Rectangle.fromDimensions(p1, -5, -10, "#000044");
  }, "rect4 should throw error because of negative width/heights");
})

QUnit.test("setColor", function(assert) {
  var p1 = new Point(0, 0);
  var p2 = new Point(1, 0);
  var p3 = new Point(3, 4);

  assert.equal(p1.distance(p2), 1, "distance between p1 and p2 is correct");
  assert.equal(p1.distance(p3), 5, "distance between p1 and p3 is correct");
})

QUnit.test("setSize", function(assert) {
  var p1 = new Point(0, 0);
  var p2 = new Point(1, 0);
  var p3 = new Point(3, 4);

  assert.equal(p1.distance(p2), 1, "distance between p1 and p2 is correct");
  assert.equal(p1.distance(p3), 5, "distance between p1 and p3 is correct");
})
