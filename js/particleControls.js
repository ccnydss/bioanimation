function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function
  
  for (var i = 0; i < particleTypes.length; i++) {
    if (particleMapper[particleTypes[i]].display) {
      animationSequencer.current().equilibrate(particleTypes[i]);
    }
  }
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
