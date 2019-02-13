class BioMain extends Sequence {
  constructor(canWidth, canHeight) {
    super();

    this.MEMBRANE_WIDTH = 25;
    this.MAX_PARTICLES = 999;
    this.MIN_PARTICLES = 1;

    // Initial state for the animation
    this.m_init = {
      containers: {
        outside: new Container (
          {
            _tl: new Point(0, 0),
            _tr: new Point(canWidth, 0),
            _br: new Point(canWidth, canHeight / 2 - this.MEMBRANE_WIDTH),
            _bl: new Point(0, (canHeight / 2 - this.MEMBRANE_WIDTH))
          },
          Container.OUTSIDE_COLOR,
          "outside"
        ),
        inside: new Container (
          {
            _tl: new Point(0, canHeight / 2 + this.MEMBRANE_WIDTH),
            _tr: new Point(canWidth, canHeight / 2 + this.MEMBRANE_WIDTH),
            _br: new Point(canWidth, canHeight),
            _bl: new Point(0, canHeight)
          },
          Container.INSIDE_COLOR,
          "inside"
        )
      },
      membrane: new Rectangle (
        {
          _tl: new Point(0, (canHeight / 2 - this.MEMBRANE_WIDTH)),       // container.outside.bl
          _tr: new Point(canWidth, canHeight / 2 - this.MEMBRANE_WIDTH),  // container.outside.br
          _br: new Point(canWidth, canHeight / 2 + this.MEMBRANE_WIDTH),  // container.inside.tr
          _bl: new Point(0, canHeight / 2 + this.MEMBRANE_WIDTH)          // container.inside.tl
        },
        color(100, 155, 180, 100)
      ),
      channels: []
    };

    this.m_state = Object.assign({}, this.m_init);
  }

  setup(s = this.m_state) {
    // Create channels
    s.channels = createChannels(s.membrane, mainSim.numParticleTypes());

    // Initialize containers with particles
    for (var loc in s.containers) {
      for (var particle in s.containers[loc].particles) {
        var amount = particleMapper[particle][loc];

        for (var i = 0; i < amount; i++) {
          s.containers[loc].addParticle(null, particle);
        }
      }
    }

    // Disable the other particles in Nernst mode.
    this.setContainerDisplays("Cl", false);
    this.setContainerDisplays("K", false);
  }

  draw(s = this.m_state) {
    s.membrane.draw();
    s.containers.inside.draw();
    s.containers.outside.draw();

    for (const channel of s.channels) {
      channel.draw();
    }
  }

  setContainerSizes(canWidth, canHeight) {
    var s = this.m_state;

    s.containers["outside"].setSize(
      {
        _tl: new Point(0, 0),
        _tr: new Point(canWidth, 0),
        _br: new Point(canWidth, canHeight / 2 - this.MEMBRANE_WIDTH),
        _bl: new Point(0, (canHeight / 2 - this.MEMBRANE_WIDTH))
      }
    );

    s.containers["inside"].setSize(
      {
        _tl: new Point(0, canHeight / 2 + this.MEMBRANE_WIDTH),
        _tr: new Point(canWidth, canHeight / 2 + this.MEMBRANE_WIDTH),
        _br: new Point(canWidth, canHeight),
        _bl: new Point(0, canHeight)
      }
    );

    s.membrane.setSize(
      {
        _tl: new Point(0, (canHeight / 2 - this.MEMBRANE_WIDTH)),       // container.outside.bl
        _tr: new Point(canWidth, canHeight / 2 - this.MEMBRANE_WIDTH),  // container.outside.br
        _br: new Point(canWidth, canHeight / 2 + this.MEMBRANE_WIDTH),  // container.inside.tr
        _bl: new Point(0, canHeight / 2 + this.MEMBRANE_WIDTH)          // container.inside.tl
      }
    );

    s.channels = createChannels(s.membrane, mainSim.numParticleTypes());

    s.containers.outside.draw(false);
    s.containers.inside.draw(false);
    s.membrane.draw();
    for (const channel of s.channels) {
      channel.draw();
    }
  }

  setContainerDisplays(particleType, boolValue) {
    this.m_state.containers.inside.setParticleDisplays(particleType, boolValue);
    this.m_state.containers.outside.setParticleDisplays(particleType, boolValue);
  }

  getNumContainers() {
    return Object.keys(this.m_state.containers).length;
  }

  getParticles(container, particleType) {
    return this.m_state.containers[container].particles[particleType];
  }

  getTransfers(container, particleType) {
    return this.m_state.containers[container].transfers[particleType];
  }

  getNumParticles(container, particleType) {
    return this.m_state.containers[container].countParticles(particleType);
  }

  insertNewParticle(container, particleType) {
    var num = this.getNumParticles(container, particleType);
    if (num >= this.MAX_PARTICLES) return;

    this.m_state.containers[container].addParticle(null, particleType);
  }

  removeParticle(container, particleType, MIN_PARTICLES) {
    var num = this.getNumParticles(container, particleType);
    if (num <= this.MIN_PARTICLES) return;

    this.m_state.containers[container].deleteParticle(particleType);
  }

  equilibrate(particleType) {
    // Get concentration (i.e., decimal values)
    var concOutside = mainSim.m_dom.m_sim_controls.concentration(particleType, "outside");
    var concInside = mainSim.m_dom.m_sim_controls.concentration(particleType, "inside");

    // Get particle population (i.e., integer values)
    var numOutside = this.getNumParticles("outside", particleType);
    var numInside = this.getNumParticles("inside", particleType);

    // Get the values that should be after equilibrium is reached
    var concEqui = (concOutside + concInside) / 2;
    var numEqui = round(concEqui);

    // Determine the transfer order. Which container to which container?
    var originalContainer, targetContainer;
    if (concOutside > concInside) {
      // More on the outside, we need to move to the inside.

      originalContainer = "outside";
      targetContainer = "inside";

      for (let i = 0; i < numOutside - numEqui; i++) {
        this.transferOut(originalContainer, particleType);
        this.transferIn(targetContainer, particleType);
      }

    } else if (concOutside < concInside) {
      // More on the inside, we need to move to the outside.
      originalContainer = "inside";
      targetContainer = "outside";

      for (let i = 0; i < numInside - numEqui; i++) {
        this.transferOut(originalContainer, particleType);
        this.transferIn(targetContainer, particleType);
      }
    }

    // Now, we need to check if we need to add or remove an additional
    //  particle, due to float arithmetic.

    //  i.e., consider the concentrations "2" and "1". No particles will be
    //  moved by the equilibration function above. But the result will be
    //  "1.5" and "1.5", meaning we should have 2 particles in both containers.
    //  We need to transferIn a particle to the container that only has 1 particle

    // Update particle counts because the above transfers might have changed it.
    numOutside = this.getNumParticles("outside", particleType);
    numInside = this.getNumParticles("inside", particleType);

    var roundedEqui = round(concEqui);

    if (roundedEqui > numOutside ) {
      this.transferIn("outside", particleType);

    } else if (roundedEqui < numOutside) {
      this.transferOut("outside", particleType);

    } else if (roundedEqui > numInside) {
      this.transferIn("inside", particleType);

    } else if (roundedEqui < numInside) {
      this.transferOut("inside", particleType);
    }

    var id = particleMapper[particleType].id;
    mainSim.updateInputs(concEqui, id);
    mainSim.computeAll(particleType);
  }

  transferIn(target, particleType) {
    // Create and move new particle from the channel's center
    // into the "target" container.

    // To transferIn to the OUTSIDE, the particle must move up.
    // To transferIn to the INSIDE, the particle must move down.

    // Operates in two stages:
    //    1. Create new particle in the channel center.
    //    2. Add it to the particle array and set velocity.

    var state = this.m_state;

    var id = particleMapper[particleType].id;

    var targetY = 0;
    var yOffset = 25;   // Set the destination slightly ABOVE or BELOW the target channel.

    var topIsTarget = false;
    var transitionVector; // Velocity (speed + direction) the particle moves.
    var afterVelocity;

    // ==========================================================
    var targetChannel;
    var chanWidth = state.channels[id].width;
    var chanHeight = state.channels[id].height;

    var chanCenterX = floor(chanWidth / 2 + 1);
    var chanCenterY = floor(chanHeight / 2 + 1);

    if (target == "inside") {
      // The particle is going to the top container
      // Get a point at the top of the channel
      targetChannel = state.channels[id].tl;

      targetY = targetChannel.y - yOffset;
      transitionVector = createVector(0, 3);
      topIsTarget = false;
    } else {
      // Get a point at the bottom of the channel
      targetChannel = state.channels[id].bl;

      targetY = targetChannel.y + yOffset;
      transitionVector = createVector(0, -3);
      topIsTarget = true;
    }

    var targetPoint = new Point (
      targetChannel.x + chanCenterX,
      targetY
    );

    var startPoint = new Point (
      targetChannel.x + chanCenterX,
      targetChannel.y - chanCenterY
    );

    // =================================================
    var targetArray = this.getParticles(target, particleType);

    var newPart = new particleMapper[particleType] (
      startPoint,
      transitionVector,
      false
    );

    newPart.onContainerChange = function (newCenterX, newCenterY) {
      // NOTE: Use onContainerChange to enable collidable and set random
      //        velocity after the particle is fully inside the container

      var isWithinOutside = (
        target == "outside" &&
        newCenterY < targetChannel.y - chanHeight - newPart.r
      );

      var isWithinInside = (
        target == "inside" &&
        newCenterY > targetChannel.y + chanHeight + newPart.r
      );

      if (isWithinOutside || isWithinInside) {
        var afterVelocity = newPart.randomDirection(topIsTarget);

        newPart.setVelocity(afterVelocity);
        newPart.collidable = true;
        newPart.display = particleMapper[particleType].display;
      }
    }
    targetArray.push(newPart);
  }

  transferOut(target, particleType) {
    // Pick a particle inside of "target" and move it into the center
    // of its channel. Then delete it from the array.

    // To transferOut of the OUTSIDE, the particle must move downwards.
    // To transferOut of the INSIDE, the particle must move upwards.

    // Operates in three stages:
    //    1. Change particle's angle to move toward a point below (or above) channel
    //    2. Move the particle straight up/down to the channel center.
    //    3. Delete the particle from the container array.

    var state = this.m_state;

    var id = particleMapper[particleType].id;

    var targetY = 0;
    var yOffset = 25;   // Set the destination slightly ABOVE or BELOW the target channel.

    var topIsTarget = false;
    var transitionVector; // Velocity (speed + direction) the particle moves.

    // ==========================================================
    var targetChannel;
    var chanWidth = state.channels[id].width;
    var chanHeight = state.channels[id].height;

    var chanCenterX = floor(chanWidth / 2 + 1);
    var chanCenterY = floor(chanHeight / 2 + 1);

    if (target == "outside") {
      // The particle is in the top container
      // Get a point at the top of the channel
      targetChannel = state.channels[id].tl;

      targetY = targetChannel.y - yOffset;
      transitionVector = createVector(0, 3);
      topIsTarget = false;
    } else {
      // Get a point at the bottom of the channel
      targetChannel = state.channels[id].bl;

      targetY = targetChannel.y + yOffset;
      transitionVector = createVector(0, -3);
      topIsTarget = true;
    }

    var targetPoint = new Point (
      targetChannel.x + chanCenterX,
      targetY
    );

    // =================================================
    var targetArray = this.getParticles(target, particleType);
    var transfersArray = this.getTransfers(target, particleType);

    // Choose particle to move to other side
    var movePclIndex = selectParticle(targetArray, targetPoint);
    var movePcl = targetArray[movePclIndex];

    transfersArray.push(movePcl);
    targetArray.splice(movePclIndex, 1);

    // Calculate angle needed to move particle towards the channel point
    var newDirection = atan2 (
      targetPoint.y - movePcl.center.y,
      targetPoint.x - movePcl.center.x
    );

    // Change velocity of particle to move in the direction of the channel point.
    movePcl.setVelocity(p5.Vector.fromAngle(newDirection));

    // Disable this particle's collision
    movePcl.collidable = false;

    var self = this;
    movePcl.onContainerChange = function(newCenterX, newCenterY) {
      if ( movePcl.nearToPoint(targetPoint) )
        movePcl.setVelocity(transitionVector);

      var leftOutside = (
        target == "outside" &&
        newCenterY > targetChannel.y + chanCenterY + movePcl.r
      );

      var leftInside = (
        target == "inside" &&
        newCenterY < targetChannel.y - chanCenterY - movePcl.r
      );

      // If the particle has left the container it as in and is now in
      // the center of the membrane channel (i.e., invisible to the user)
      if (leftOutside || leftInside)
        transfersArray.splice(0, 1);
    }
  }

  otherLocation(location) {
    return location == "inside" ? "outside" : "inside";
  }
}
