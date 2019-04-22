QUnit.module("Simulator Tests");

QUnit.test("constructor", function(assert) {
  var sim = new Simulator();
  assert.ok(sim);
});

QUnit.test("numParticleTypes", function(assert) {
  var sim = new Simulator();
  assert.deepEqual(sim.numParticleTypes(), 3);
});

QUnit.test("questionsAreHidden", function(assert) {
  var sim = new Simulator();
  assert.ok(sim.questionsAreHidden);
});
