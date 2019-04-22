/**
* This class is essentially infrastructure to support
* the creation of multiple co-existing animation scenarios. See {@tutorial Future}
* for what this means.
*/
class SequenceManager {
  constructor(arr = []) {
    /**
    * The sequence iterator, current animation index being displayed.
    * @type {integer}
    */
    this.seqitr = 0;

    /**
    * The array of animation sequences that the SequenceManager manages.
    * @type {Sequence[]}
    */
    this.seqArr = arr;

    /**
    * The total number of sequences so far.
    * @type {integer}
    */
    this.numSeq = this.seqArr.length;
  }

  /**
  * The import method 
  */
  import(animation) {
    this.seqArr.push(animation);
    this.numSeq += 1;
  }

  importMany(arr) {
    for (const seq of arr) {
      this.import(seq);
    }
  }

  len() {
    return this.seqArr.length;
  }

  current() {
    return this.seqArr[this.seqitr];
  }

  setup() {
    if (this.len()) {
      for (const seq of this.seqArr) {
        seq.setup();
      }
    }
  }

  draw() {
    if (this.len()) {
      this.current().draw();
    }
  }

  next(reset=true) {
    if (this.len()) {
      this.seqitr = (this.seqitr + 1) % this.len();   // Enable circular switching

      var {width, height} = mainSim.dom.getSize();
      this.current().setContainerSizes(width, height);

      if (reset) this.current().reset();
    }
  }

  prev(reset=true) {
    if (this.len()) {
      this.seqitr = (this.seqitr == 0) ? this.len() - 1 : this.seqitr - 1;

      var {width, height} = mainSim.dom.getSize();
      this.current().setContainerSizes(width, height);

      if (reset) this.current().reset();
    }
  }
}

class Sequence {
  constructor(init_state, setupfunc, drawfunc) {
    this._init = Object.assign({}, init_state);
    this.state = Object.assign({}, init_state);

    this._setup = setupfunc;
    this._draw = drawfunc;
  }

  setup() {
    this._setup(this.state);
  }

  draw() {
    this._draw(this.state);
  }

  setState(new_state) {
    this.state = Object.assign({}, new_state);
  }

  reset() {
    this.setState(this._init);
  }
}
