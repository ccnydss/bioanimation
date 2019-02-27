var topleft_test = new Point(0, 0);
var topright_test = new Point(10, 0);
var botleft_test = new Point(0, 10);
var botright_test = new Point(10, 10);

QUnit.module("Channel Tests");

QUnit.test("constructor", function(assert) {
  var testCh1 = new Channel (
    {
      _tl: topleft_test,
      _tr: topright_test,
      _br: botright_test,
      _bl: botleft_test
    },
    "Na"
  );

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
