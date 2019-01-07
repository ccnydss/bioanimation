// var seq1 = new Sequence (
//   { x: 0 },
//   function(s) {
//     rect(s.x, 20, 55, 55, 20);
//     s.x = (s.x + 3) % 800;
//   }
// );
function createBioMain() {
  var biostate = {
    containers: {
      outside: new Container (
        {
          _tl: new Point(0, 0),
          _tr: new Point(canWidth, 0),
          _br: new Point(canWidth, canHeight / 2 - thickness),
          _bl: new Point(0, (canHeight / 2 - thickness))
        },
        Container.OUTSIDE_COLOR,
        "outside"
      ),
      inside: new Container (
        {
          _tl: new Point(0, canHeight / 2 + thickness),
          _tr: new Point(canWidth, canHeight / 2 + thickness),
          _br: new Point(canWidth, canHeight),
          _bl: new Point(0, canHeight)
        },
        Container.INSIDE_COLOR,
        "inside"
      )
    }
  };

  function biosetup(s) {
    // Initialize containers with particles
    for (var loc in s.containers) {
      for (var particle in s.containers[loc].particles) {
        var amount = particleMapper[particle][loc];

        for (var i = 0; i < amount; i++) {
          var newPart = createNewParticle(particle, s.containers[loc])
          s.containers[loc].addParticle(newPart);
        }
      }
    }

    s.containers.outside.draw();
    s.containers.inside.draw();
  };

  function biodraw(s) {
    s.containers.inside.draw();
    s.containers.outside.draw();
  }


  var bio_main = new Sequence (
    biostate, biosetup, biodraw
  );

  return bio_main;
}
