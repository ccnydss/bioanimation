/**
* This class is essentially infrastructure to support the creation of multiple
* co-existing animation scenarios. See {@tutorial Future} for what this means.
* @example
* animationSequencer = new SequenceManager([bioMainSequence, test1Seq])
* //bioMainSequence from class bioMain and test1Seq from class Test1
*/
class SequenceManager {
  constructor(arr = []) {
    /**
    * The sequence iterator, current animation index being displayed.
    * @type {integer}
    * @access private
    */
    this.seqitr = 0;

    /**
    * The array of animation sequences that the SequenceManager manages.
    * @type {Sequence[]}
    * @access private
    */
    this.seqArr = arr;

    /**
    * The total number of sequences so far.
    * @type {integer}
    * @access private
    */
    this.numSeq = this.seqArr.length;
  }

  /**
  * The import method allows us to insert a single new animation Sequence into
  * the manager.
  * @access public
  * @param {Sequence} animation - The animation sequence.
  * @example
  * var seq = new Sequence (
  *  {x: 0},
  *  function(s) {
  *      s.x = 5;
  *    },
  *    function(s) {
  *      s.x += 1;
  *    }
  *  )
  * animationSequencer.import(seq)
  */
  import(animation) {
    this.seqArr.push(animation);
    this.numSeq += 1;
  }

  /**
  * This method allows us to insert multiple Sequences at once via an array.
  * @access public
  * @param {Sequence[]} arr - Array of animation Sequences.
  * @example
  *var seq = new Sequence (
  *  {x: 0},
  *  function(s) {
  *      s.x = 5;
  *    },
  *    function(s) {
  *      s.x += 1;
  *    }
  *  )
  var seq2 = new Sequence (
  *  {x: 0},
  *  function(s) {
  *      s.x = 10;
  *    },
  *    function(s) {
  *      s.x += 2;
  *    }
  *  )
  * animationSequencer.importMany([seq,seq2]);
  */
  importMany(arr) {
    for (const seq of arr) {
      this.import(seq);
    }
  }

  /**
  * Tell us how many sequences are currently loaded into this manager.
  * @access public
  * @return {integer}
  * animationSequencer.len();
  */
  len() {
    return this.seqArr.length;
  }

  /**
  * Give us the animation Sequence that is currently executing.
  * @access public
  * @return {Sequence}
  * @example
  * animationSequencer.current();
  */
  current() {
    return this.seqArr[this.seqitr];
  }

  /**
  * A setup function for use within p5.js' setup() hook. This will call the
  * setup functions of all sequences in the manager.
  * @access public
  *animationSequencer.setup();
  */
  setup() {
    if (this.len()) {
      for (const seq of this.seqArr) {
        seq.setup();
      }
    }
  }

  /**
  * A draw function for use within p5.js' draw() hook. This will call the draw
  * functions for all sequences in the manager.
  * @access public
  *animationSequencer.draw();
  */
  draw() {
    if (this.len()) {
      this.current().draw();
    }
  }

  /**
  * The next method can be called if you want to switch the current Sequence
  * to the one that was loaded after it. If you call `next()` on the last
  * Sequence in the array, it will circle over to the first Sequence in the array
  * automatically.
  * @access public
  * @param {boolean} [reset=true] - The reset parameter will be used if you want
  * the new Sequence to be set to its initial conditions.
  * @example
  * animationSequencer.next();
  */
  next(reset=true) {
    if (this.len()) {
      this.seqitr = (this.seqitr + 1) % this.len();   // Enable circular switching

      var {width, height} = mainSim.dom.getSize();
      this.current().setContainerSizes(width, height);

      if (reset) this.current().reset();
    }
  }

  /**
  * Similar to `next`, this method allows you to switch to the previous
  * Sequence that loaded in the manager. If you call this while the manager is
  * on the first Sequence, it will also circle back to the last Sequence.
  * @access public
  * @param {boolean} [reset=true] - The reset parameter will be used if you want
  * the new Sequence to be set to its initial conditions.
  * animationSequencer.prev(false);
  */
  prev(reset=true) {
    if (this.len()) {
      this.seqitr = (this.seqitr == 0) ? this.len() - 1 : this.seqitr - 1;

      var {width, height} = mainSim.dom.getSize();
      this.current().setContainerSizes(width, height);

      if (reset) this.current().reset();
    }
  }
}

/**
* Sequence is the class for managing animation parameters. In our code it will
* create the containers, particles, and provide methods that Simulator can
* use to interact with the animation.
*
* This class will typically need to be extended in a child class to be fully
* used. Look at {@link BioMain} for an example.
* @example
*   var seq = new Sequence (
*  {x: 0},
*  function(s) {
*      s.x = 5;
*    },
*    function(s) {
*      s.x += 1;
*    }
*  )
*/
class Sequence {
  /**
  * Initialize a Sequence object instance.
  * @access public
  * @param {Object} init_state - The initial state/parameters for the animation.
  * @param {function} setupfunc - The function to be used when `setup()` is called.
  * @param {function} drawfunc - The function to be used when `draw()` is called.
  */
  constructor(init_state, setupfunc, drawfunc) {
    this._init = Object.assign({}, init_state);
    this.state = Object.assign({}, init_state);

    this._setup = setupfunc;
    this._draw = drawfunc;
  }

  /**
  * This is to be run within the setup function for p5.js, which gets called by SequenceManager.
  * This function is overloaded by the constructor when the Sequence object is
  * created.
  * @access public
  * @example
  * seq.setup();
  */
  setup() {
    this._setup(this.state);
  }

  /**
  * This is to be run within the draw function for p5.js, which gets called by SequenceManager.
  * This function is overloaded by the constructor when the Sequence object is
  * created.
  * @access public
  * @example
  * seq.draw();
  */
  draw() {
    this._draw(this.state);
  }

  /**
  * This is the reset function for p5.js, which gets called by SequenceManager
  * when the manager switches between Sequences with `next` and `prev`.
  * @access public
  * @example
  * seq.reset();
  */
  reset() {
    this.setState(this._init);
  }

  /**
  * This is the setState function for p5.js, which is used for the Sequence to
  * alter its own parameters as the app runs.
  * @access private
  * @params {Object} new_state - The new state object.
  * @example
  * seq.setState( {x: 0});
  */
  setState(new_state) {
    this.state = Object.assign({}, new_state);
  }
}
