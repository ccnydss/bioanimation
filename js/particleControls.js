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

  var outsideArray = containers["outside"].particles[particleType];
  var insideArray = containers["inside"].particles[particleType];

  particleAmount = outsideArray.length + insideArray.length;

  // The equilibrium function: how top and bottom should be split.
  equiAmount = Math.floor(particleAmount / 2);

  // if either top or bottom has equilibrium amount, we can return
  if (outsideArray.length == equiAmount || insideArray.length == equiAmount) {
    return;
  }

  // NOTE: see about replacing this with the actual container instead of strings
  largerArrayLocation = outsideArray.length > insideArray.length ?
    "outside" :
    "inside";

  // The number of particles that need to be transferred to each equilibrium
  var transfers = containers[largerArrayLocation].countParticles(particleType) - equiAmount;

  // Perform N transfers from the denser container to the sparser container.
  largerArrayLocations[particleType] = largerArrayLocation;
  transferParticle(particleType, largerArrayLocations);
}

function transferParticle(particleType, location) {
  // input: string, array
  // transfers a particle from top to bottom

  var id = particleMapper[particleType].id;

  // Set names of current array is in and array to transfer particle into
  // NOTE: See about replacing this logic with the containers instead of strings
  var currentArray = containers[location[particleType]].particles[particleType];

  if (currentArray.length == 0) return;

  // Set destination container to opposite of the denser container
  var transferLocation = (location[particleType] == "outside") ?
    "inside" :
    "outside";

  var transferArray = containers[transferLocation].particles[particleType];

  // Determine which cell channel the particle should move towards.
  // If the particle is in the top division
  var targetY = 0;
  var yOffset = 25; // Set the destination slightly ABOVE (or BELOW) the target channel
  var topIsTarget = false;
  var transitionVector; // Which way (up or down) the particle will move as it crosses channels

  if (location[particleType] == "outside") {
    // If the particle is in the top division
    var targetChannel = channels[id].tl;
    targetY = targetChannel.y - yOffset;
    transitionVector = createVector(0, 3);
    topIsTarget = false;
  } else {
    // If the particle is in the bottom division
    var targetChannel = channels[id].bl;
    targetY = targetChannel.y + yOffset;
    transitionVector = createVector(0, -3);
    topIsTarget = true;
  }

  // Get the offset from corner of the channel to its center.
  var cWidth = channels[0].width;
  var cHeight = channels[0].height;

  var horizontalOffset = Math.floor(cWidth / 2 + 1);
  var verticalOffset = Math.floor(cHeight / 2 + 1);

  // Choose a particle to move to other side.
  var targetPoint = new Point(
    targetChannel.x + horizontalOffset,
    targetY
  );

  var movePclIndex = selectParticle(currentArray, targetPoint);
  var movePcl = currentArray[movePclIndex];

  // Calculate angle needed to move particle towards channel center.
  var newDirection = atan2(
    targetPoint.y - movePcl.center.y,
    targetPoint.x - movePcl.center.x
  );

  // Change velocity of particle to move in the direction of the channel.
  movePcl.setVelocity(p5.Vector.fromAngle(newDirection));

  // Disable this particle's collision
  movePcl.collidable = false;

  movePcl.onContainerChange = function(newCenterX, newCenterY) {
    if ( movePcl.nearToPoint(targetPoint) ) {
      movePcl.setVelocity(transitionVector);
    }

    var cond1 = (location[particleType] == "outside" && newCenterY > targetChannel.y + cHeight + movePcl.r);
    var cond2 = (location[particleType] == "inside" && newCenterY < targetChannel.y - cHeight - movePcl.r);

    if (cond1 || cond2) {
      // Copy the particle to create a clone of the instance
      var newPart = clone(movePcl);
      newPart.collidable = true;

      var afterVelocity = newPart.randomDirection(topIsTarget);
      newPart.setVelocity(afterVelocity);

      // Remove the first particle in the array, aka movePcl
      currentArray.splice(movePclIndex, 1);

      transferArray.push(newPart);

      updateInputs(particleType, location[particleType], id);

      // Repeatedly call equilibrate until all particles have transferred over.
      equilibrate(particleType);
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

  var particleArray = containers[particleLocation].particles[particleType];

  if (particleArray.length >= MaxParticles) return;

  var newParticle = createNewParticle(particleType, containers[particleLocation]);

  newParticle.setDisplay(true);
  containers[particleLocation].addParticle(newParticle);

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

  var particleArray = containers[particleLocation].particles[particleType];

  if (particleArray.length <= 0) return;

  particleArray.splice(particleArray.length - 1, 1);
  containers[particleLocation].deleteParticle(particleType);

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

  var particleArray = containers[particleLocation].particles[particleType];

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

  var difference = Math.abs(updatedAmount - particleArray.length)

  // If the amount entered is less than 0, increase the amount
  if (updatedAmount > particleArray.length) {
    for (var i = 0; i < difference; i++) {
      insertParticle(evt);
    }
  } else if (updatedAmount < particleArray.length) {
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
