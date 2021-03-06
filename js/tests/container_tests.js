QUnit.module("Container Tests");

QUnit.test("constructor", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );
  assert.ok(cont1, "Object created");
});

QUnit.test("addParticle", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );

  var test_particle = new Na (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  cont1.addParticle(test_particle);

  assert.equal(cont1.particles.Na.length, 1, "Added particle");
  assert.equal(cont1.particles.Cl.length, 0);
  assert.equal(cont1.particles.K.length, 0);

  cont1.addParticle(null, "K");

  assert.equal(cont1.particles.Na.length, 1, "Added particle");
  assert.equal(cont1.particles.Cl.length, 0);
  assert.equal(cont1.particles.K.length, 1);
});

QUnit.test("deleteParticle", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );

  var test_particle = new Na (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  cont1.addParticle(test_particle);
  assert.equal(cont1.particles.Na.length, 1, "Added particle");

  cont1.deleteParticle("Na");
  assert.equal(cont1.particles.Na.length, 0, "Removed particle");
});

// /* Can't really test because has random side effects */
// QUnit.test("createNewParticle", function(assert) {
//   assert.ok(1);
// });

QUnit.test("setParticleDisplays", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );

  Na.display = true;
  K.display = false;
  Cl.display = false;

  var na1 = new Na (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  var na2 = new Na (
    new Point(1, 2),
    { x: 10, y: 5 },
    true
  );

  var cl1 = new Cl (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  var k1 = new K (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  cont1.addParticle(na1);
  cont1.addParticle(na2);
  cont1.addParticle(cl1);
  cont1.addParticle(k1);

  cont1.setParticleDisplays("Na", false);

  assert.equal(cont1.particles.Na[0].display, false);
  assert.equal(cont1.particles.Na[1].display, false);
  assert.equal(Na.display, false);

  assert.equal(cont1.particles.K[0].display, false);
  assert.equal(K.display, false);

  assert.equal(cont1.particles.Cl[0].display, false);
  assert.equal(Cl.display, false);

  cont1.setParticleDisplays("Cl", true);

  assert.equal(cont1.particles.Na[0].display, false);
  assert.equal(cont1.particles.Na[1].display, false);
  assert.equal(Na.display, false);

  assert.equal(cont1.particles.K[0].display, false);
  assert.equal(K.display, false);

  assert.equal(cont1.particles.Cl[0].display, true);
  assert.equal(Cl.display, true);
});

QUnit.test("countParticles", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );

  var na1 = new Na (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  var na2 = new Na (
    new Point(1, 2),
    { x: 10, y: 5 },
    true
  );

  var cl1 = new Cl (
    new Point(10, 25),
    { x: 10, y: 5 },
    true
  );

  cont1.addParticle(na1);
  cont1.addParticle(na2);
  cont1.addParticle(cl1);

  assert.equal(cont1.countParticles("Na"), 2);
  assert.equal(cont1.countParticles("Cl"), 1);
  assert.equal(cont1.countParticles("K"), 0);
});

// // Inherited from rectangle, already tested there.
// QUnit.test("setSize", function(assert) {
//   assert.ok(1);
// });

QUnit.test("createLabels", function(assert) {
  var cont1 = new Container (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "ffeedd",
    "inside"
  );

  var lab = cont1.createLabels();
  assert.ok(lab);
  assert.equal(lab.text, "Intracellular");
  assert.equal(lab.tl.x, 5 );
  assert.equal(lab.tl.y, topleft_test.y + 15);
});
