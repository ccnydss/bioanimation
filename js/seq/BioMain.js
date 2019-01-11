class BioMain extends Sequence {
  constructor(canWidth, canHeight) {
    super();

    this.MEMBRANE_WIDTH = 25;
    this.MAX_PARTICLES = 25;
    this.MIN_PARTICLES = 1;

    console.log("constructing", name, canWidth, canHeight);

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
    s.channels = createChannels(s.membrane, particleTypes.length);

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

    s.channels = createChannels(s.membrane, particleTypes.length);
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
    // input: string;
    // usage: "Na", "Cl", "K"
    // Brings outside and inside concentrations into equilibrium

    var numOutside = this.getNumParticles("outside", particleType);
    var numInside = this.getNumParticles("inside", particleType);

    var particleAmount = numOutside + numInside;

    // The equilibrium function: how top and bottom should be split.
    var equiAmount = Math.floor(particleAmount / 2);

    // if either top or bottom has equilibrium amount, we can return
    if (numOutside == equiAmount || numInside == equiAmount) {
      return;
    }

    var originLocation = numOutside > numInside ?
      "outside" :
      "inside";

    var transferLocation = numOutside > numInside ?
      "inside" :
      "outside";

    // The number of particles that need to be transferred to each equilibrium
    var id = particleMapper[particleType].id;

    this.transferParticle(originLocation, transferLocation, particleType, id);
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

        // Recursively call equilibrate until all particles have transferred over.
        self.equilibrate(particleType);
        updateInputs(particleType, originalContainer, id);
      }
    }
  }
}
