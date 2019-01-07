class SequenceManager {
  constructor(arr = []) {
    this.m_seqitr = 0;     // The sequence iterator, current animation being displayed.
    this.m_seqArr = arr;   // The array of animation objects
    this.m_numSeq = this.m_seqArr.length;   // Number of sequences
  }

  import(animation) {
    this.m_seqArr.push(animation);
    this.m_numSeq += 1;
  }

  importMany(arr) {
    for (const seq of arr) {
      this.import(seq);
    }
  }

  setup() {
    if (this.m_numSeq) {
      this.m_seqArr[this.m_seqitr].setup();
    }
  }

  draw() {
    if (this.m_numSeq) {
      this.m_seqArr[this.m_seqitr].draw();
    }
  }

  next() {
    var len = this.m_numSeq;
    if (len) {
      this.m_seqitr = (this.m_seqitr + 1) % len;
      this.m_seqArr[this.m_seqitr].reset();
    }
  }

  prev() {
    var len = this.m_numSeq;
    if (len) {
      this.m_seqitr = (this.m_seqitr == 0) ? len - 1 : this.m_seqitr - 1;
      this.m_seqArr[this.m_seqitr].reset();
    }
  }
}

class Sequence {
  constructor(init_state, setupfunc, drawfunc) {
    this.m_init = Object.assign({}, init_state);
    this.m_state = Object.assign({}, init_state);

    this.m_setup = setupfunc;
    this.m_draw = drawfunc;
  }

  setup() {
    this.m_setup(this.m_state);
  }

  draw() {
    this.m_draw(this.m_state);
  }

  setState(new_state) {
    this.m_state = Object.assign({}, new_state);
  }

  reset() {
    this.setState(this.m_init);
  }
}
