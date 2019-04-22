QUnit.module("Bio Main Tests");

QUnit.test("constructor", function(assert) {
  var bm = new BioMain(500, 500);
  assert.ok(bm);
});
