/**
* BioMain is the primary animation sequence that the application uses.
* @example
* bioMainSequence = new BioMain(200,300);
*/
class BioMain extends Sequence {
  /**
  * Initialize a BioMain object instance.
  * @access public
  * @param {integer} canWidth - The width of the animation canvas.
  * @param {integer} canHeight - THe height of the animation canvas.
  */
  constructor(canWidth, canHeight) {
    super();

    /**
    * How thick the cell membrane (horizontal bar in the middle of the cell) is
    * in terms of height.
    * @private
    * @type {integer}
    */
    this.MEMBRANE_WIDTH = 25;

    /**
    * The color of the cell membrane.
    * @private
    * @type {p5.Color | string}
    */
    this.MEMBRANE_COLOR = color(100, 155, 180, 100);

    /**
    * The maximum number of particles allowed in the animation.
    * @public
    * @type {integer}
    */
    this.MAX_PARTICLES = 999;

    /**
    * The minimum number of particles allowed in the animation.
    * @public
    * @type {integer}
    */
    this.MIN_PARTICLES = 1;

    /**
    * The initial state for the animation.
    * @private
    * @type {Object}
    */
    this._init = {
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
        this.MEMBRANE_COLOR
      ),
      channels: []
    };

    /**
    * The current state for the animation. Updates throughout time.
    * @private
    * @type {Object}
    */
    this.state = Object.assign({}, this._init);
  }

  /**
  * The Sequence setup function.
  * @param {Object} [s=this.state] - The state to use for setup purposes.
  */
  setup(s = this.state) {
    // Create channels
    s.channels = createChannels (
      s.membrane,
      mainSim.particle_types
    );

    // Initialize containers with particles
    for (var loc in s.containers) {
      for (var particle in s.containers[loc].particles) {
        var amount = particleMapper[particle][loc];

        for (var i = 0; i < amount; i++) {
          s.containers[loc].addParticle(null, particle);
        }

        mainSim.dom.sim_inputs.setConcentration(particle, loc, amount);
      }
    }

    // Disable the other particles in Nernst mode.
    this.setContainerDisplays("Cl", false);
    this.setContainerDisplays("K", false);
  }

  /**
  * The Sequence draw function.
  * @param {Object} [s=this.state] - The state to use for setup purposes.
  */
  draw(s = this.state) {
    s.membrane.draw();
    s.containers.inside.draw();
    s.containers.outside.draw();

    for (const channel of s.channels) {
      channel.draw();
    }
  }

  /**
  * Method for changing the size of the top and bottom containers of the
  * animation. These containers correspond to the outside and inside of the
  * cell, respectively.
  * @access public
  * @param {integer} canWidth - The width of the canvas.
  * @param {integer} canHeight - The height of the canvas.
  * @example
  * bioMainSequence.setContainerSizes(300,400);
  */
  setContainerSizes(canWidth, canHeight) {
    var s = this.state;

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

    s.membrane.setSize (
      {
        _tl: new Point(0, (canHeight / 2 - this.MEMBRANE_WIDTH)),       // container.outside.bl
        _tr: new Point(canWidth, canHeight / 2 - this.MEMBRANE_WIDTH),  // container.outside.br
        _br: new Point(canWidth, canHeight / 2 + this.MEMBRANE_WIDTH),  // container.inside.tr
        _bl: new Point(0, canHeight / 2 + this.MEMBRANE_WIDTH)          // container.inside.tl
      }
    );

    s.channels = createChannels(s.membrane, mainSim.particle_types);

    s.containers.outside.draw(false);
    s.containers.inside.draw(false);
    s.membrane.draw();
    for (const channel of s.channels) {
      channel.draw();
    }
  }

  /**
  * Method for changing the display property of a particle type.
  * @access public
  * @param {String} particle_type - The type of the particle, ex: "Na", "Cl", or "K".
  * @param {boolean} bool_value - The display setting to use.
  * @example
  * bioMainSequence.setContainerDisplays("Na", true);
  */
  setContainerDisplays(particle_type, bool_value) {
    this.state.containers.inside.setParticleDisplays(particle_type, bool_value);
    this.state.containers.outside.setParticleDisplays(particle_type, bool_value);
  }

  /**
  * Method for changing the background color of the top and bottom containers
  * of the animation.
  * @access public
  * @param {String} location - The name of the location: ex "inside" or "outside".
  * @param {p5.Color|String} color_obj - The color to set container to.
  * @example
  * bioMainSequence.setContainerColor("outside","#ff0000" );
  */
  setContainerColor(location, color_obj) {
    this.state.containers[location].setColor(color_obj);
  }

  /**
  * Method for changing the background color of the cell membrane of the
  * animation. Use by animationSequencer.current().setMembraneColor(mycolor)
  * @access public
  * @param {p5.Color|String} color_obj - The color to set container to.
  * @example
  * bioMainSequence.setMembraneColor("#ff0000");
  */
  setMembraneColor(color_obj) {
    this.MEMBRANE_COLOR = color_obj;
    this.state.membrane.setColor(this.MEMBRANE_COLOR);
  }

  /**
  * Method for getting the number of containers.
  * @access public
  * @return {integer}
  * @example
  * bioMainSequence.getNumContainers();
  */
  getNumContainers() {
    return Object.keys(this.state.containers).length;
  }

  /**
  * Method for getting the array of particles of a given type in a given
  * location
  * @access public
  * @param {String} container - The container name to look at: ex; "inside" or "outside".
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @return {Particle[]}
  *@example
  * bioMainSequence.getParticles("inside", "Na");
  */
  getParticles(container, particle_type) {
    return this.state.containers[container].particles[particle_type];
  }

  /**
  * Method for getting the array of particles currently in transit between
  * containers.
  * @access public
  * @param {String} container - The container name to look at: ex; "inside" or "outside".
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @return {Particle[]}
  * bioMainSequence.getTransfers("outside", "Cl");
  */
  getTransfers(container, particle_type) {
    return this.state.containers[container].transfers[particle_type];
  }

  /**
  * Method for getting the number of particles of a given type in a given
  * location
  * @access public
  * @param {String} container - The container name to look at: ex; "inside" or "outside".
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @return {integer}
  *@example
  * bioMainSequence.("inside","Cl");
  */
  getNumParticles(container, particle_type) {
    return this.state.containers[container].countParticles(particle_type);
  }

  /**
  * Method for inserting a random particle into a given location.
  * @access public
  * @param {String} container - The container name to look at: ex; "inside" or "outside".
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @example
  * bioMainSequence.insertNewParticle("inside", "K");
  */
  insertNewParticle(container, particle_type) {
    var num = this.getNumParticles(container, particle_type);
    if (num >= this.MAX_PARTICLES) return;

    this.state.containers[container].addParticle(null, particle_type);
  }

  /**
  * Method for getting the array of particles of a given type in a given
  * location
  * @access public
  * @param {String} container - The container name to look at: ex; "inside" or "outside".
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @return {Particle[]}
  * @example
  * bioMainSequence.removeParticle("outside", "Cl");
  */
  removeParticle(container, particle_type, MIN_PARTICLES) {
    var num = this.getNumParticles(container, particle_type);
    if (num <= this.MIN_PARTICLES) return;

    this.state.containers[container].deleteParticle(particle_type);
  }

  /**
  * Method for initiating the equilibrium animation. The particles in a container
  * with higher concentration must move into the container with lower concentration.
  * @access public
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @example
  * bioMainSequence.equilibrate("Na");
  */
  equilibrate(particle_type) {
    // Get concentration (i.e., decimal values)
    var conc_outside = mainSim.dom.sim_inputs.concentration(particle_type, "outside");
    var conc_inside = mainSim.dom.sim_inputs.concentration(particle_type, "inside");

    // Get particle population (i.e., integer values)
    var num_outside = this.getNumParticles("outside", particle_type);
    var num_inside = this.getNumParticles("inside", particle_type);

    // Get the values that should be after equilibrium is reached
    var conc_equi = (conc_outside + conc_inside) / 2;
    var num_equi = round(conc_equi);

    // Determine the transfer order. Which container to which container?
    var original_container, target_container;
    if (conc_outside > conc_inside) {
      // More on the outside, we need to move to the inside.

      original_container = "outside";
      target_container = "inside";

      for (let i = 0; i < num_outside - num_equi; i++) {
        this.transferOut(original_container, particle_type);
        this.transferIn(target_container, particle_type);
      }

    } else if (conc_outside < conc_inside) {
      // More on the inside, we need to move to the outside.
      original_container = "inside";
      target_container = "outside";

      for (let i = 0; i < num_inside - num_equi; i++) {
        this.transferOut(original_container, particle_type);
        this.transferIn(target_container, particle_type);
      }
    }

    // Now, we need to check if we need to add or remove an additional
    //  particle, due to float arithmetic.

    //  i.e., consider the concentrations "2" and "1". No particles will be
    //  moved by the equilibration function above. But the result will be
    //  "1.5" and "1.5", meaning we should have 2 particles in both containers.
    //  We need to transferIn a particle to the container that only has 1 particle

    // Update particle counts because the above transfers might have changed it.
    num_outside = this.getNumParticles("outside", particle_type);
    num_inside = this.getNumParticles("inside", particle_type);

    var rounded_equi = round(conc_equi);

    if (rounded_equi > num_outside ) {
      this.transferIn("outside", particle_type);

    } else if (rounded_equi < num_outside) {
      this.transferOut("outside", particle_type);

    } else if (rounded_equi > num_inside) {
      this.transferIn("inside", particle_type);

    } else if (rounded_equi < num_inside) {
      this.transferOut("inside", particle_type);
    }

    var id = particleMapper[particle_type].id;
    mainSim.updateInputs(conc_equi, id);
    mainSim.computeAll(particle_type);
  }

  /**
  * Create and move new particle from the channel's center into the `target`
  * container.
  *
  * To transferIn to the OUTSIDE, the particle must move up.
  * To transferIn to the INSIDE, the particle must move down.
  *
  * Operates in two stages:
  *    1. Create new particle in the channel center.
  *    2. Add it to the particle array and set velocity.
  * @access private
  * @param {String} target - The container name the particle is going towards.
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  * @example
  * bioMainSequence.transferIn("outside", "Na");
  */
  transferIn(target, particle_type) {
    var state = this.state;

    var id = particleMapper[particle_type].id;

    var target_y = 0;
    var offset_y = 25;   // Set the destination slightly ABOVE or BELOW the target channel.

    var top_is_target = false;
    var transition_vector; // Velocity (speed + direction) the particle moves.
    var after_velocity;

    // ==========================================================
    var target_channel;
    var chan_width = state.channels[id].width;
    var chan_height = state.channels[id].height;

    var chan_center_x = floor(chan_width / 2 + 1);
    var chan_center_y = floor(chan_height / 2 + 1);

    if (target == "inside") {
      // The particle is going to the top container
      // Get a point at the top of the channel
      target_channel = state.channels[id].tl;

      target_y = target_channel.y - offset_y;
      transition_vector = createVector(0, 3);
      top_is_target = false;
    } else {
      // Get a point at the bottom of the channel
      target_channel = state.channels[id].bl;

      target_y = target_channel.y + offset_y;
      transition_vector = createVector(0, -3);
      top_is_target = true;
    }

    var target_point = new Point (
      target_channel.x + chan_center_x,
      target_y
    );

    var startPoint = new Point (
      target_channel.x + chan_center_x,
      target_channel.y - chan_center_y
    );

    // =================================================
    var target_array = this.getParticles(target, particle_type);

    var new_part = new particleMapper[particle_type] (
      startPoint,
      transition_vector,
      false
    );

    new_part.onContainerChange = function (new_center_x, new_center_y) {
      // NOTE: Use onContainerChange to enable collidable and set random
      //        velocity after the particle is fully inside the container

      var is_within_outside = (
        target == "outside" &&
        new_center_y < target_channel.y - chan_height - new_part.radius
      );

      var is_within_inside = (
        target == "inside" &&
        new_center_y > target_channel.y + chan_height + new_part.radius
      );

      if (is_within_outside || is_within_inside) {
        var after_velocity = new_part.randomDirection(top_is_target);

        new_part.setVelocity(after_velocity);
        new_part.collidable = true;
        new_part.display = particleMapper[particle_type].display;
      }
    }
    target_array.push(new_part);
  }

  /**
  * Pick a particle inside of "target" and move it into the center
  * of its channel. Then delete it from the array.
  *
  * To transferOut of the OUTSIDE, the particle must move downwards.
  * To transferOut of the INSIDE, the particle must move upwards.
  *
  * Operates in three stages:
  *    1. Change particle's angle to move toward a point below (or above) channel
  *    2. Move the particle straight up/down to the channel center.
  *    3. Delete the particle from the container array.
  * @access private
  * @param {String} target - The container name the particle is going towards.
  * @param {String} particle_type - The particle name to get: ex; "Na", "Cl", or "K".
  *@example
  * bioMainSequence.transferOut("outside","Cl");
  */
  transferOut(target, particle_type) {
    var state = this.state;

    var id = particleMapper[particle_type].id;

    var target_y = 0;
    var offset_y = 25;   // Set the destination slightly ABOVE or BELOW the target channel.

    var top_is_target = false;
    var transition_vector; // Velocity (speed + direction) the particle moves.

    // ==========================================================
    var target_channel;
    var chan_width = state.channels[id].width;
    var chan_height = state.channels[id].height;

    var chan_center_x = floor(chan_width / 2 + 1);
    var chan_center_y = floor(chan_height / 2 + 1);

    if (target == "outside") {
      // The particle is in the top container
      // Get a point at the top of the channel
      target_channel = state.channels[id].tl;

      target_y = target_channel.y - offset_y;
      transition_vector = createVector(0, 3);
      top_is_target = false;
    } else {
      // Get a point at the bottom of the channel
      target_channel = state.channels[id].bl;

      target_y = target_channel.y + offset_y;
      transition_vector = createVector(0, -3);
      top_is_target = true;
    }

    var target_point = new Point (
      target_channel.x + chan_center_x,
      target_y
    );

    // =================================================
    var target_array = this.getParticles(target, particle_type);
    var transfers_array = this.getTransfers(target, particle_type);

    // Choose particle to move to other side
    var move_pcl_index = selectParticle(target_array, target_point);
    var move_pcl = target_array[move_pcl_index];

    transfers_array.push(move_pcl);
    target_array.splice(move_pcl_index, 1);

    // Calculate angle needed to move particle towards the channel point
    var new_direction = atan2 (
      target_point.y - move_pcl.center.y,
      target_point.x - move_pcl.center.x
    );

    // Change velocity of particle to move in the direction of the channel point.
    move_pcl.setVelocity(p5.Vector.fromAngle(new_direction));

    // Disable this particle's collision
    move_pcl.collidable = false;

    var self = this;
    move_pcl.onContainerChange = function(new_center_x, new_center_y) {
      if ( move_pcl.nearToPoint(target_point) )
        move_pcl.setVelocity(transition_vector);

      var left_outside = (
        target == "outside" &&
        new_center_y > target_channel.y + chan_center_y + move_pcl.radius
      );

      var left_inside = (
        target == "inside" &&
        new_center_y < target_channel.y - chan_center_y - move_pcl.radius
      );

      // If the particle has left the container it as in and is now in
      // the center of the membrane channel (i.e., invisible to the user)
      if (left_outside || left_inside)
        transfers_array.splice(0, 1);
    }
  }

  /**
  * Helper function for fetching the name of the "other" container.
  * @access private
  * @param {String} location - The container name we want the opposite of.
  * @return {String}
  *@example
  * bioMainSequence.otherLocation("inside");//returns "outside";
  */
  otherLocation(location) {
    return location == "inside" ? "outside" : "inside";
  }
}
