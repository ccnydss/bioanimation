var largerArrayLocations = {}; // global dictionary used to prevent equilibrating one particle type from interrupting another.

function startEquilibrate(evt) {
  // input: the element that triggered the event; however this input is unused in this function

  for (var i = 0; i < particleTypes.length; i++) {
    if (particlesProperties[particleTypes[i]]["display"]) {
      equilibrate(particleTypes[i]);
    }
  }
}

function equilibrate(particleType) {
  // input: string;
  // usage: "Na", "Cl", "K"
  // Brings outside and inside concentrations into equilibrium

  outsideArray = particles["outside"][particleType];
  insideArray = particles["inside"][particleType];

  particleAmount = outsideArray.length + insideArray.length;

  // The equilibrium function: how top and bottom should be split.
  equiAmount = Math.floor(particleAmount / 2);

  // if either top or bottom has equilibrium amount, we can return
  if (outsideArray.length == equiAmount || insideArray.length == equiAmount) {
    return;
  }

  largerArrayLocation = outsideArray.length > insideArray.length ?
    "outside" :
    "inside";

  // The number of particles that need to be transferred to each equilibrium
  var transfers = particles[largerArrayLocation][particleType].length - equiAmount;

  // Perform N transfers from the denser container to the sparser container.
  largerArrayLocations[particleType] = largerArrayLocation;
  transferParticle(particleType, largerArrayLocations);
}

function transferParticle(particleType, location) {
  // input: string, array
  // transfers a particle from top to bottom

  var id = particlesProperties[particleType]["id"];

  // Set names of current array is in and array to transfer particle into
  var currentArray = particles[location[particleType]][particleType];
  if (currentArray.length == 0) return;

  // Set destination container to opposite of the denser container
  var transferLocation = (location[particleType] == "outside") ?
    "inside" :
    "outside";

  var transferArray = particles[transferLocation][particleType];

  // Determine which cell channel the particle should move towards.
  // If the particle is in the top division
  var targetY = 0;
  var yOffset = 25; // Set the destination slightly ABOVE (or BELOW) the target channel
  var topIsTarget = false;

  if (location[particleType] == "outside") {
    // If the particle is in the top division
    var targetChannel = channels[id].tl;
    targetY = targetChannel.y - yOffset;

    topIsTarget = false;
  } else {
    // If the particle is in the bottom division
    var targetChannel = channels[id].bl;
    targetY = targetChannel.y + yOffset;

    topIsTarget = true;
  }

  // Get the offset from corner of the channel to its center.
  var cWidth = channels[0].width;
  var cHeight = channels[0].height;

  var horizontalOffset = Math.floor(cWidth / 2 + 1);
  var verticalOffset = Math.floor(cHeight / 2 + 1);

  // Choose a particle to move to other side.
  var movePcl = selectParticle(currentArray);

  // Calculate angle needed to move particle towards channel center.
  var newDirection = atan2(
    targetY - movePcl.center.y,
    targetChannel.x + horizontalOffset - movePcl.center.x
  );

  // Change velocity of particle to move in the direction of the channel.
  movePcl.setVelocity(p5.Vector.fromAngle(newDirection));

  // Disable this particle's collision
  movePcl.collidable = false;

  movePcl.onContainerChange = function(newX, newY) {
    if (
      newY <= targetY &&
      newX > targetChannel.x &&
      newX < targetChannel.x + cWidth &&
      location[particleType] == "inside"
    ) {
      movePcl.setVelocity(createVector(0, -3));
    } else if (
      newY >= targetY &&
      newX > targetChannel.x &&
      newX < targetChannel.x + cWidth &&
      location[particleType] == "outside"
    ) {
      movePcl.setVelocity(createVector(0, 3));
    }

    var cond1 = (location[particleType] == "outside" && newY > targetChannel.y + cHeight);
    var cond2 = (location[particleType] == "inside" && newY < targetChannel.y - cHeight);

    if (cond1 || cond2) {
      // Copy the particle to create a clone of the instance
      var newPart = clone(movePcl);
      newPart.collidable = true;

      var afterVelocity = newPart.randomDirection(topIsTarget);
      newPart.setVelocity(afterVelocity);
      console.log(movePcl, newPart);

      // Remove the first particle in the array, aka movePcl
      currentArray.splice(0, 1);
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

  var particleArray = particles[particleLocation][particleType];

  if (particleArray.length >= MaxParticles) return;

  randomX = containers[particleLocation].tl.x + particlesProperties[particleType].radius + (Math.floor(Math.random() * xRange));
  randomY = containers[particleLocation].tl.y + particlesProperties[particleType].radius + (Math.floor(Math.random() * yRange));

  velocities = velocityRange;
  var x_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var y_vel = Math.floor(Math.random() * (velocities.length - 1)) + 0;
  var velocity = createVector(velocities[x_vel], Math.abs(velocities[y_vel]));

  var newParticle = new factory[particleType](
    new Point(randomX, randomY),
    particlesProperties[particleType].radius,
    velocity,
    true
  );

  newParticle.setDisplay(true);
  particleArray.push(newParticle);
  FormulaInputCalculation(particleType);

  updateInputs(particleType, particleLocation, id);
}

function removeParticle(evt) {
  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  var particleArray = particles[particleLocation][particleType];

  if (particleArray.length <= 0) return;

  particleArray.splice(particleArray.length - 1, 1);

  FormulaInputCalculation(particleType);

  updateInputs(particleType, particleLocation, id);
}

function changeNumParticles(evt) {
  // input: the element that triggered the event (Input buttons);
  console.log("is this it??");

  var eventID = evt.target.id;
  var row = 4;
  var id = (eventID % row) - 1;
  var particleType = particleTypes[id];
  var particleLocation = (eventID < row) ?
    "outside" :
    "inside";

  var particleArray = particles[particleLocation][particleType];

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

function selectParticle(pArray) {
  return pArray[0];
}
