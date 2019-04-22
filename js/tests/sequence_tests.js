QUnit.module("Sequence Manager Tests");

QUnit.test("constructor", function(assert) {
  assert.ok(1);
});

QUnit.test("import", function(assert) {
  assert.ok(1);
});

QUnit.test("importMany", function(assert) {
  assert.ok(1);
});

QUnit.test("len", function(assert) {
  assert.ok(1);
});

QUnit.test("current", function(assert) {
  assert.ok(1);
});

QUnit.test("next", function(assert) {
  assert.ok(1);
});

QUnit.test("prev", function(assert) {
  assert.ok(1);
});

////////////////////////////////////////////////////////////////////////////////
QUnit.module("Sequence Tests");

QUnit.test("constructor", function(assert) {
  var seq = new Sequence (
    {x: 0},
    function(s) {
      s.x = 5;
    },
    function(s) {
      s.x += 1;
    }
  )
  assert.ok(seq);
});

QUnit.test("setup", function(assert) {
  var seq = new Sequence (
    {x: 0},
    function(s) {
      s.x = 5;
    },
    function(s) {
      s.x += 1;
    }
  );

  assert.equal(seq.state.x, 0)
  seq.setup();
  assert.equal(seq.state.x, 5)
});

QUnit.test("setup", function(assert) {
  var seq = new Sequence (
    {x: 0},
    function(s) {
      s.x = 5;
    },
    function(s) {
      s.x += 1;
    }
  );

  seq.setup();
  assert.equal(seq.state.x, 5)
  seq.draw();
  assert.equal(seq.state.x, 6)
});


QUnit.test("reset", function(assert) {
  var seq = new Sequence (
    {x: 0},
    function(s) {
      s.x = 5;
    },
    function(s) {
      s.x += 1;
    }
  )

  seq.setup(); // x becomes 5
  seq.draw();  // x becomes 6
  seq.draw();  // x becomes 7
  assert.equal(seq.state.x, 7);

  seq.reset(); // x should reset to 0, the initial state passed in.
  assert.equal(seq.state.x, 0);
});

QUnit.test("setState", function(assert) {
  var seq = new Sequence (
    {x: 0},
    function(s) {
      s.x = 5;
    },
    function(s) {
      s.x += 1;
    }
  )

  seq.setup(); // x becomes 5
  seq.draw();  // x becomes 6
  seq.draw();  // x becomes 7
  assert.equal(seq.state.x, 7);

  seq.setState({x: 38});
  assert.equal(seq.state.x, 38);
});
