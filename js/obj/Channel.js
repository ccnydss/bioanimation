class Channel extends Rectangle {
  constructor(_points, _particle) {
    super(_points);
    this.fill_color = particleMapper[_particle].color;
  }
}

var createChannels = function(tl, tr, br, bl, numOfChannels) {
  // Input: 4 Points, Integer
  // Function: Creates an array of Channels for each particle type
  // Output: Array

  var channels = [];
  var offset = 30;
  var channelHeight = abs(tl.y - bl.y);
  var cellWallWidth = abs(tr.x - tl.x);
  for (var i = 1; i <= numOfChannels; i++) {
    // Get center x coordinate for cell wall
    var center = (i) * Math.floor(cellWallWidth / (numOfChannels + 1));

    // Get coordinates of channel rectangle
    var channelTL = new Point(center - offset, tl.y);
    var channelTR = new Point(center + offset, tr.y);
    var channelBR = new Point(center + offset, br.y);
    var channelBL = new Point(center - offset, bl.y);

    // Add new channel to channels array
    channels.push(
      new Channel(
        {
          _tl: channelTL,
          _tr: channelTR,
          _br: channelBR,
          _bl: channelBL
        },
        particleTypes[i - 1]
      )
    );
  }

  return channels;
}
