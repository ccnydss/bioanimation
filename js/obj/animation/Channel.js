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
* @example
* testig example
*
* @param {Rectangle} membrane - The size and shape of the particle membrane,
* should be the length of the whole container / canvas.
*
* @param {array} particle_array - An array of strings containing the names of
* all the particle types we want to create channels for.
*
* @returns {array} An array of Channel objects.
*/
function createChannels(membrane, particle_array) {
  var channels = [];
  var offset = 30;
// declares different variables used for rectangle
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

    /**
    * Each channel being created is a set of new coordinates
    *@example
    * @param {channel_tl} - first the variable name and then an identifier to make it unique
    * channels.push combines all the coordinates together
    * when pushing an object, it is adding it into the array
    * in this case, all the coordinates are being pushed into channel
    * @param {channel.push} - pushes all the channels made into the particle_array
    */
    /**
    * channels.push is used to insert new channels into the array.
    * In this case, these new channels are coordinates of rectangle.
    * @param {Method} push - a method used to insert items into an array and stored
    * for later use.
    *
    * @example
    //Creating an array and then inserting items into it
    * var p1 = new Point(0, 0);
    * var p2 = new Point(5, 0);
    * var p3 = new Point(5, 3);
    * var p4 = new Point(0, 3);
    * var coordinate = [];
    * coordinate.push (p1);
    * coordinate.push (p2);
    * coordinate.push (p3);
    * coordinate.push (p4);
    */
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
