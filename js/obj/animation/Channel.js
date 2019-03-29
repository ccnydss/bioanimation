/** Class that represents a single particle membrane channel */
class Channel extends Rectangle {
  /**
  * @param {Object} _points - An object of 4 points with keys named
  * appropriately { _tl: p1, _tr: p2, _bl: p3, _br: p4}
  *
  * @param {String} _particle - The particle type that this Channel should represent.
  * Currently, it only dictates the Channel instance's color, but in the future
  * may be used to make sure it is only permeable to ions of this type.
  */
  constructor(_points, _particle) {
    super(_points);
    this.fill_color = particleMapper[_particle].color;
  }
}

/**
* createChannels is used to instantiate the sketch with all of the defined
* particle ion types evenly spaced along a cell membrane.
*
* @param {Rectangle} membrane - The size and shape of the particle membrane,
* should be the length of the whole container / canvas.
*
* @param {integer} num_of_channels - How many channels should be created.
* We should remove this parameter, because we'll know how many channels to
* make based off of the next parameter...
*
* @param {array} particle_array - An array of strings containing the names of
* all the particle types we want to create channels for.
*
* @returns {array} An array of Channel objects.
*/
function createChannels(membrane, particle_array) {
  var channels = [];
  var offset = 30;

  var num_of_channels = particle_array.length;
  var cell_wall_width = membrane.width;

  for (var i = 1; i <= num_of_channels; i++) {
    // Get center x coordinate for cell wall
    var center = (i) * Math.floor(cell_wall_width / (num_of_channels + 1));

    // Get coordinates of channel rectangle
    var channel_tl = new Point(center - offset, membrane.tl.y);
    var channel_tr = new Point(center + offset, membrane.tr.y);
    var channel_br = new Point(center + offset, membrane.br.y);
    var channel_bl = new Point(center - offset, membrane.bl.y);

    // Add new channel to channels array
    channels.push (
      new Channel (
        {
          _tl: channel_tl,
          _tr: channel_tr,
          _br: channel_br,
          _bl: channel_bl
        },
        particle_array[i - 1]
      )
    );
  }

  return channels;
}
