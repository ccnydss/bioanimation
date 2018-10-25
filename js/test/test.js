QUnit.test( "hello test", function( assert ) {
  assert.ok( 2 == "1", "Passed!" );
});

QUnit.test( "other file", function( assert ) {
  sum = qtest(3, 4);

  assert.deepEqual( sum, 8, "Sum is equal");
})
