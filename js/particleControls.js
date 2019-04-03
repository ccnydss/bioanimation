function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < mainSim.numParticleTypes(); i++) {
    if (particleMapper[mainSim.particle_types[i]].display) {
      animationSequencer.current().equilibrate(mainSim.particle_types[i]);
    }
  }
}

function selectParticle(pArray, tPoint) {
  // Select the particle that is closest to the channel
  var minimumDistance = pArray[0].center.distance(tPoint);
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
