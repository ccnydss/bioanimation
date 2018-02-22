class A {
  constructor(_a, _b) {
    this.a = _a;
    this.b = _b;
  }

  f1(b) {
    console.log (b.x);
    b.x = 55;
  }
}

class B {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
}

var myA = new A(1, 2);
var myB = new B(3, 4);

console.log(myA, myB);

myA.f1(myB);

console.log(myB);
