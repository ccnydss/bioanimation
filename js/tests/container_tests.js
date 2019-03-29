QUnit.module("Container Tests");

QUnit.test("constructor", function(assert) {
  var cont1 = new Container(
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
// 
// QUnit.test("moveNoCollision", function(assert) {
//   var cont1 = new Container(
//     {
//       _tl: topleft_test,
//       _tr: topright_test,
//       _br: botright_test,
//       _bl: botleft_test
//     },
//     "ffeedd",
//     "inside"
//   );
//   var test_particle = new Particle (
//     new Point(10, 25),
//     20,
//     { x: 10, y: 5 },
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.moveNoCollision(test_particle);
//
//   assert.deepEqual(test_particle.x, 13, "X coordinate has changed");
//   assert.deepEqual(test_particle.y, 16, "Y coordinate has changed");
// });
//
// QUnit.test("clips", function(assert) {
//   var cont1 = new Container(
//     {
//       _tl: topleft_test,
//       _tr: topright_test,
//       _br: botright_test,
//       _bl: botleft_test
//     },
//     "ffeedd",
//     "inside"
//   );
//
//   // Test that particle stops at bottom wall
//   var vel1 = new Point(0, 4);
//   var p1 = new Particle (
//     new Point(10, 25),
//     20,
//     vel1,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.clips(p1);
//   assert.deepEqual(p1.move_velocity.y, 2, "Particle decelerated for bottom");
//
//   // Test that particle stops at top wall
//   var vel2 = new Point(0, -4);
//   var p2 = new Particle (
//     new Point(10, 25),
//     20,
//     vel2,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.clips(p2);
//   assert.deepEqual(p2.move_velocity.y, -2, "Particle decelerated for top");
//
//   // Test that particle stops at right wall
//   var vel3 = new Point(4, 0);
//   var p3 = new Particle (
//     new Point(10, 25),
//     20,
//     vel3,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.clips(p3);
//   assert.deepEqual(p3.move_velocity.x, 2, "Particle decelerated for right");
//
//   // Test that particle stops at left wall
//   var vel4 = new Point(-4, 0);
//   var p4 = new Particle (
//     new Point(10, 25),
//     20,
//     vel4,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.clips(p4);
//   assert.deepEqual(p4.move_velocity.x, -2, "Particle decelerated for left");
// });
//
// QUnit.test("hit", function(assert) {
//   var cont1 = new Container(
//     {
//       _tl: topleft_test,
//       _tr: topright_test,
//       _br: botright_test,
//       _bl: botleft_test
//     },
//     "ffeedd",
//     "inside"
//   );
//
//   // Test that particle reflects at bottom wall
//   var vel1 = new Point(0, 4);
//   var p1 = new Particle (
//     new Point(10, 25),
//     20,
//     vel1,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.hit(p1, 1.175);
//   assert.deepEqual(p1.move_velocity.y, -4.7, "Particle reflected at bottom");
//
//   // Test that particle reflects at top wall
//   var vel2 = new Point(0, -4);
//   var p2 = new Particle (
//     new Point(10, 25),
//     20,
//     vel2,
//     true,
//     "#ffaa00",
//     true
//   );
//
//   cont1.hit(p2, 1.175);
//   assert.deepEqual(p2.move_velocity.y, 4.7, "Particle reflected at top");
//
//   // Test that particle reflects at right wall
//   var vel3 = new Point(4, 0);
//   var p3 = new Particle(8, 5, 4, vel3, true);
//
//   cont1.hit(p3, 1.175);
//   assert.deepEqual(p3.move_velocity.x, -4.7, "Particle reflected at right");
//
//   // Test that particle reflects at left wall
//   var vel4 = new Point(-4, 0);
//   var p4 = new Particle(2, 5, 4, vel4, true);
//
//   cont1.hit(p4, 1.175);
//   assert.deepEqual(p4.move_velocity.x, 4.7, "Particle reflected at left");
// });
