var largerArrayLocations = {}; // global dictionary used to prevent equilibrating one particle type from interrupting another.

function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < particleTypes.length; i++) {
    if (particleMapper[particleTypes[i]].display) {
      equilibrate(particleTypes[i]);
    }
  }
}

function equilibrate(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  // Brings outside and inside concentrations into equilibrium

  var numOutside = bioMainSequence.getNumParticles("outside", particleType);
  var numInside = bioMainSequence.getNumParticles("inside", particleType);

  particleAmount = numOutside + numInside;

  // The equilibrium function: how top and bottom should be split.
  equiAmount = Math.floor(particleAmount / 2);

  // if either top or bottom has equilibrium amount, we can return
  if (numOutside == equiAmount || numInside == equiAmount) {
    return;
  }

  // NOTE: see about replacing this with the actual container instead of strings
  largerArrayLocation = numOutside > numInside ?
    "outside" :
    "inside";

  // The number of particles that need to be transferred to each equilibrium
  var transfers = bioMainSequence.getNumParticles(largerArrayLocation, particleType) - equiAmount;

  // Perform N transfers from the denser container to the sparser container.
  largerArrayLocations[particleType] = largerArrayLocation;

  transferParticle(particleType, largerArrayLocations);
}

function transferParticle(particleType, location) {
  // NOTE: remove this eventually

  // input: string, array
  // transfers a particle from top to bottom

  var id = particleMapper[particleType].id;

  // Set destination container to opposite of the denser container
  var transferLocation = (location[particleType] == "outside") ?
    "inside" :
    "outside";

  bioMainSequence.transferParticle(location[particleType], transferLocation, particleType, id);

  updateInputs(particleType, location[particleType], id);

  // Repeatedly call equilibrate until all particles have transferred over.
  // equilibrate(particleType);
}

function insertParticle(evt) {
  // Add a particle to its array
  // Return the new number of particles of this type
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  bioMainSequence.insertNewParticle(particleLocation, particleType, MaxParticles);
  updateInputs(particleType, particleLocation, id);
}

function createNewParticle(type, cont) {
  xRange = cont.tr.x - cont.tl.x - 100;
  yRange = cont.br.y - cont.tr.y - 100;

  velocities = [-1, -1.25, 1.25, 1];
  var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var velocity = createVector(velocities[x_vel], velocities[y_vel]);

  // Get random location
  randomX = cont.tl.x + particleMapper[type].diameter + (Math.floor(Math.random() * xRange));
  randomY = cont.tl.y + particleMapper[type].diameter + (Math.floor(Math.random() * yRange));

  return new particleMapper[type](
    new Point(randomX, randomY),
    velocity,
    true
  );
}

function removeParticle(evt) {
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  bioMainSequence.removeParticle(particleLocation, particleType, 0);
  updateInputs(particleType, particleLocation, id);
}

function changeNumParticles(evt) {
  // input: the element that triggered the event (Input buttons);
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  var numParticles = bioMainSequence.getNumParticles(particleLocation, particleType);

  var updatedAmount = input[eventID].value();

  // If the amount entered is invalid, alert user
  if (
    isNaN(updatedAmount) ||
    Math.floor(updatedAmount) != updatedAmount ||
    updatedAmount < 0
  ) {
    alert("Please enter valid input.");
    return;
  } else if (updatedAmount > MaxParticles) {
    // If the amount entered is greater than the maximum, force it to maximum and alert user

    input[eventID].value(MaxParticles);
    updatedAmount = MaxParticles;
    alert("Maximum amount is " + MaxParticles + ".");
  }

  var difference = Math.abs(updatedAmount - numParticles)

  // If the amount entered is less than 0, increase the amount
  if (updatedAmount > numParticles) {
    for (var i = 0; i < difference; i++) {
      insertParticle(evt);
    }
  } else if (updatedAmount < numParticles) {
    for (var i = 0; i < difference; i++) {
      removeParticle(evt);
    }
  }
}

function selectParticle(pArray, tPoint) {
  // Select the particle that is closest to the channel
  var minimumDistance = 1000000;
  var minPoint = 0;

  for (var i = 0; i < pArray.length; i++) {
    var dist = pArray[i].center.distance(tPoint);

    if (dist < minimumDistance) {
      minimumDistance = dist;
      minPoint = i;
    }
  }

  return minPoint;
}
