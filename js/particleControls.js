function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < mainSim.numParticleTypes(); i++) {
    if (particleMapper[mainSim.m_particle_types[i]].display) {
      animationSequencer.current().equilibrate(mainSim.m_particle_types[i]);
    }
  }
}

function highLightInput(evt) {
  evt.target.setSelectionRange(0,  evt.target.value.length)
}
function insertParticle(evt) {
  // Add a particle to its array
  // Return the new number of particles of this type
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = mainSim.m_particle_types[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  animationSequencer.current().insertNewParticle(particleLocation, particleType);
  updateInputs(particleType, particleLocation, id);
}

function removeParticle(evt) {
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = mainSim.m_particle_types[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  animationSequencer.current().removeParticle(particleLocation, particleType, 0);
  updateInputs(particleType, particleLocation, id);
}

function changeNumParticles(evt) {
  // input: the element that triggered the event (Input buttons);
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = mainSim.m_particle_types[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  var numParticles = animationSequencer.current().getNumParticles(particleLocation, particleType);
  var MaxParticles = animationSequencer.current().MAX_PARTICLES;

  var updatedAmount = mainSim.m_dom.m_inputs[eventID].value();

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

    mainSim.m_dom.m_inputs[eventID].value(MaxParticles);
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
