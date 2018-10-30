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
