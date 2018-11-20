var containers = {};

//Just for initializing
var particleTypes = ["Na", "Cl", "K"];

var inEquilbrateState = {}; // global dictionary used to flag if particle is currently in equilbrate state.
inEquilbrateState[particleTypes[0]] = false;
inEquilbrateState[particleTypes[1]] = false;

var particlesProperties = {
  "Na": {
    "id": 0,
    "color": "#F5CE28",
    "radius": 15,
    "display": true,
    "charge": 1,
    "permeability": 0.03,
    "inside": 2,
    "outside": 14
  },
  "Cl": {
    "id": 1,
    "color": "#CD5C5C",
    "radius": 15,
    "display": false,
    "charge": -1,
    "permeability": 0.1,
    "inside": 13,
    "outside": 1
  },
  "K": {
    "id": 2,
    "color": "#35B235",
    "radius": 15,
    "display": false,
    "charge": 1,
    "permeability": 1,
    "inside": 1,
    "outside": 12
  }
};

var velocityRange = [-1, -1.25, 1.25, 1];

//For local particles on each box
var MaxParticles = 25;
var particles = {
  "inside": {
    "Na": [],
    "Cl": [],
    "K": []
  },
  "outside": {
    "Na": [],
    "Cl": [],
    "K": []
  }
}

var channels = {
  "Na": [],
  "Cl": [],
  "K": []
};

var numContainer = 2;
var plusButton = [],
  minusButton = [],
  textboard = [], // NOTE: More specific variable name
  input = [], // NOTE: above
  simSetting = [];

var UIBoxs = [],
  equations = [];

var canWidth;
var canHeight;

// Make a channel a square for now
var thickness = 25; // NOTE: More specific variable name

var lastNernstParticle = "Na";
var questionText = [];

var tempSetting = (37 + 273.13);

function setup() {
  noFill();

  // Defines the simulator's layout as well as "canWidth", "canHeight"
  makeLayout();

  //Relative to parent coordinate

  containers["outside"] = new Container(
    {
      _tl: new Point(0, 0),
      _tr: new Point(canWidth, 0),
      _br: new Point(canWidth, canHeight / 2 - thickness),
      _bl: new Point(0, (canHeight / 2 - thickness))
    },
    Container.OUTSIDE_COLOR(),
    "outside"
  );

  UIBoxs[0] = new UIBox(
    {
      _tl: new Point(0, 0),
      _tr: new Point(canWidth, 0),
      _br: new Point(canWidth, canHeight / 2),
      _bl: new Point(0, canHeight / 2)
    }
  );
  UIBoxs[0].draw();

  containers["inside"] = new Container(
    {
      _tl: new Point(0, canHeight / 2 + thickness),
      _tr: new Point(canWidth, canHeight / 2 + thickness),
      _br: new Point(canWidth, canHeight),
      _bl: new Point(0, canHeight)
    },
    Container.INSIDE_COLOR(),
    "inside"
  );

  UIBoxs[1] = new UIBox(
    {
      _tl: new Point(0, canHeight / 2),
      _tr: new Point(canWidth, canHeight / 2),
      _br: new Point(canWidth, canHeight),
      _bl: new Point(0, canHeight)
    }
  );
  UIBoxs[1].draw();

  for (var location in particles) {
    for (var particle in particles[location]) {
      xRange = containers[location].tr.x - containers[location].tl.x - 100;
      yRange = containers[location].br.y - containers[location].tr.y - 100;
      var amount = particlesProperties[particle][location];
      for (var i = 0; i < amount; i++) {
        velocities = velocityRange;
        var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
        var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
        var velocity = createVector(velocities[x_vel], velocities[y_vel]);

        // Get random location
        randomX = containers[location].tl.x + particlesProperties[particle]["radius"] + (Math.floor(Math.random() * xRange));
        randomY = containers[location].tl.y + particlesProperties[particle]["radius"] + (Math.floor(Math.random() * yRange));
        particles[location][particle].push(
          new factory[particle](
            new Point(randomX, randomY),
            particlesProperties[particle]["radius"],
            velocity,
            true
          )
        );
      }
    }
  }

  makeUIs(true);
  startNernst();

  //Only show one particle at the beginning
  disableInputForParticle("Cl");
  disableInputForParticle("K");

  for (var i = 0; i < particles["inside"]["Cl"].length; i++) {
    setDisplay(particles["inside"]["Cl"][i], false);
  }
  for (var i = 0; i < particles["outside"]["Cl"].length; i++) {
    setDisplay(particles["outside"]["Cl"][i], false);
  }
  for (var i = 0; i < particles["inside"]["K"].length; i++) {
    setDisplay(particles["inside"]["K"][i], false);
  }
  for (var i = 0; i < particles["outside"]["K"].length; i++) {
    setDisplay(particles["outside"]["K"][i], false);
  }

  FormulaInputCalculation(particleTypes[0]);

  //Load all the equation at begin, otherelse will cause bug
  //For some reason, MathJax-Element will be create after few millisecond
  //Remove the Goldman preset equation
  Initializor = setTimeout(function() {
    if (document.getElementById('MathJax-Element-1-Frame')) {
      document.getElementById('MathJax-Element-1-Frame').style.display = "inline";
      document.getElementById('MathJax-Element-2-Frame').style.display = "none";
    }
    clearTimeout(Initializor);
  }, 300);

}

function draw() {
  clear();

  UIBoxs[0].draw();
  UIBoxs[1].draw();

  strokeWeight(0);

  containers["inside"].draw();
  containers["outside"].draw();

  for (var i = 0; i < channels.length; i++) {
    channels[i].draw();
  }

  strokeWeight(1);

  // NOTE: Where is the particles array defined?
  //       Turn this into a function perhaps
  for (var location in particles) {
    for (var particle in particles[location]) {
      for (var i = 0; i < particles[location][particle].length; i++) {
        particles[location][particle][i].color();
        particles[location][particle][i].move(containers[location]);
      }
    }
  }
}
