function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < mainSim.numParticleTypes(); i++) {
    if (particleMapper[mainSim.m_particle_types[i]].display) {
      animationSequencer.current().equilibrate(mainSim.m_particle_types[i]);
    }
  }
}

function highLightInput(evt) {
  evt.target.setSelectionRange(0, evt.target.value.length)
}

function changeNumParticles(evt, updatedAmount=evt.target.value) {
  // input: the element that triggered the event (Input buttons);
  var eventID = evt.target.id;

  var particleType = evt.target.attributes['data-ptype'].value;
  var particleLocation = evt.target.attributes['data-location'].value;

  var numParticles = animationSequencer.current().getNumParticles(particleLocation, particleType);
  var MaxParticles = animationSequencer.current().MAX_PARTICLES;

  if (!updatedAmount) {
    var symbol = evt.target.innerText;
    var current = mainSim.m_dom.m_sim_controls.controls[particleLocation].rows[eventID].value();
    updatedAmount = (symbol == "+") ? current + 1 : current - 1;
  }

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

    mainSim.m_dom.m_sim_controls.controls[particleLocation].rows[eventID].value(MaxParticles);
    updatedAmount = MaxParticles;
    alert("Maximum amount is " + MaxParticles + ".");
  }

  var difference = Math.abs(updatedAmount - numParticles)

  // If the amount entered is less than 0, increase the amount
  if (updatedAmount > numParticles) {
    for (var i = 0; i < difference; i++) {
      animationSequencer.current().insertNewParticle(particleLocation, particleType);
    }
  } else if (updatedAmount < numParticles) {
    for (var i = 0; i < difference; i++) {
      animationSequencer.current().removeParticle(particleLocation, particleType, 0);
    }
  }

  updateInputs(particleType, particleLocation, eventID);
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
