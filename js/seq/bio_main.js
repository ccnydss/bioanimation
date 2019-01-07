class BioMain extends Sequence {
  constructor() {
    super();

    // Initial state for the animation
    this.m_init = {
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
      },
      channels: []
    };

    this.m_state = Object.assign({}, this.m_init);
  }

  setup(s = this.m_state) {
    // Create channels
    var division = new Rectangle (
      {
        _tl: s.containers["outside"].bl,
        _tr: s.containers["outside"].br,
        _br: s.containers["inside"].tr,
        _bl: s.containers["inside"].tl
      }
    );

    s.channels = createChannels(division, particleTypes.length);

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

    s.containers.inside.setParticleDisplays("Cl", false);
    s.containers.outside.setParticleDisplays("Cl", false);

    s.containers.inside.setParticleDisplays("K", false);
    s.containers.outside.setParticleDisplays("K", false);
  }

  draw(s = this.m_state) {
    s.containers.inside.draw();
    s.containers.outside.draw();

    for (var i = 0; i < s.channels.length; i++) {
      s.channels[i].draw();
    }
  }

  setContainerSizes(canWidth, canHeight, thickness) {
    var s = this.m_state;

    s.containers["outside"].setSize(
      {
        _tl: new Point(0, 0),
        _tr: new Point(canWidth, 0),
        _br: new Point(canWidth, canHeight / 2 - thickness),
        _bl: new Point(0, (canHeight / 2 - thickness))
      }
    );

    s.containers["inside"].setSize(
      {
        _tl: new Point(0, canHeight / 2 + thickness),
        _tr: new Point(canWidth, canHeight / 2 + thickness),
        _br: new Point(canWidth, canHeight),
        _bl: new Point(0, canHeight)
      }
    );
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

  getNumParticles(container, particleType) {
    return this.m_state.containers[container].countParticles(particleType);
  }

  insertNewParticle(container, particleType, MAX_PARTICLES) {
    var num = this.getNumParticles(container, particleType);
    if (num >= MAX_PARTICLES) return;

    var newParticle = createNewParticle(particleType, this.m_state.containers[container]);

    newParticle.setDisplay(true);
    this.m_state.containers[container].addParticle(newParticle);
  }

  removeParticle(container, particleType, MIN_PARTICLES) {
    var num = this.getNumParticles(container, particleType);
    if (num <= 0) return;

    this.m_state.containers[container].deleteParticle(particleType);
  }

  transferParticle(originalContainer, targetContainer, particleType, id) {
    var currentArray = this.getParticles(originalContainer, particleType);
    if (currentArray.length == 0) return;

    var transferArray = this.getParticles(targetContainer, particleType);

    // Determine which cell channel the particle should move towards.
    // If the particle is in the top division
    var targetY = 0;
    var yOffset = 25; // Set the destination slightly ABOVE (or BELOW) the target channel
    var topIsTarget = false;
    var transitionVector; // Which way (up or down) the particle will move as it crosses channels

    if (originalContainer == "outside") {
      // If the particle is in the top division
      var targetChannel = this.m_state.channels[id].tl;

      targetY = targetChannel.y - yOffset;
      transitionVector = createVector(0, 3);
      topIsTarget = false;
    } else {
      // If the particle is in the bottom division
      var targetChannel = this.m_state.channels[id].bl;

      targetY = targetChannel.y + yOffset;
      transitionVector = createVector(0, -3);
      topIsTarget = true;
    }

    // Get the offset from corner of the channel to its center.
    var cWidth = this.m_state.channels[0].width;
    var cHeight = this.m_state.channels[0].height;

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

    var self = this;

    movePcl.onContainerChange = function(newCenterX, newCenterY) {
      if ( movePcl.nearToPoint(targetPoint) ) {
        movePcl.setVelocity(transitionVector);
      }

      var cond1 = (originalContainer == "outside" && newCenterY > targetChannel.y + cHeight + movePcl.r);
      var cond2 = (originalContainer == "inside" && newCenterY < targetChannel.y - cHeight - movePcl.r);

      if (cond1 || cond2) {
        // Copy the particle to create a clone of the instance
        var newPart = clone(movePcl);
        newPart.collidable = true;

        var afterVelocity = newPart.randomDirection(topIsTarget);
        newPart.setVelocity(afterVelocity);

        // Remove the selected particle in the array, aka movePcl
        currentArray.splice(movePclIndex, 1);
        transferArray.push(newPart);

        updateInputs(particleType, originalContainer, id);

        // Repeatedly call equilibrate until all particles have transferred over.
        equilibrate(particleType);
      }
    }
  }
}
