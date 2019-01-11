class Test1 extends BioMain {
  constructor(canWidth, canHeight) {
    super(canWidth, canHeight);
  }

  setup(s = this.m_state) {
    // Create channels
    s.channels = createChannels(s.membrane, particleTypes.length);

    // Initialize containers with particles
    for (var loc in s.containers) {
      for (var particle in s.containers[loc].particles) {
        var amount = 1;

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
}
