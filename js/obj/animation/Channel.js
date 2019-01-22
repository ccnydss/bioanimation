class Channel extends Rectangle {
  constructor(_points, _particle) {
    super(_points);
    this.fill_color = particleMapper[_particle].color;
  }
}

function createChannels(membrane, numOfChannels) {
  // Input: Rectangle, Integer
  // Function: Creates an array of Channels for each particle type
  // Output: Array

  var channels = [];
  var offset = 30;

  var channelHeight = membrane.height;
  var cellWallWidth = membrane.width;

  for (var i = 1; i <= numOfChannels; i++) {
    // Get center x coordinate for cell wall
    var center = (i) * Math.floor(cellWallWidth / (numOfChannels + 1));

    // Get coordinates of channel rectangle
    var channelTL = new Point(center - offset, membrane.tl.y);
    var channelTR = new Point(center + offset, membrane.tr.y);
    var channelBR = new Point(center + offset, membrane.br.y);
    var channelBL = new Point(center - offset, membrane.bl.y);

    // Add new channel to channels array
    channels.push(
      new Channel(
        {
          _tl: channelTL,
          _tr: channelTR,
          _br: channelBR,
          _bl: channelBL
        },
        mainSim.m_particle_types[i - 1]
      )
    );
  }

  return channels;
}
