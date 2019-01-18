function clone(obj) {
  // Create a copy of an object when you want to avoid mutating the original
  //    by accident.

  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}

function setClassMember(instance, membername, value) {
  // "instance" is usually the keyword `this`. I.e., the object itself.
  var cl = Object.getPrototypeOf(instance).constructor;
  cl[membername] = value;
}

function getClassMember(instance, membername) {
  return Object.getPrototypeOf(instance).constructor[membername];
}

function randomFromRanges(arrayOfRanges) {
  // Example input: [ [1, 2], [8, 9], [10, 15] ]
  // Example output: a random number between 1 and 2, OR, between 8 and 9, OR,
  //    between 10 and 15.
  var numOfRanges = arrayOfRanges.length;
  var selectedRange = floor(random(0, numOfRanges));
  var selectedChoices = arrayOfRanges[selectedRange];

  return random(selectedChoices[0], selectedChoices[1]);
}

function loadText(url, tag) {
  // input1: string;
  // usage: 'questions.json' (filename)
  // input2: string
  // usage: 'goldman_1', 'nernst_1' (Data.name)

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);
      document.getElementById("q1").innerHTML = myArr[tag].join('');;
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function elementCreator(element, eid, parent, options = { content: '', className: '', mousePressed: null }) {
  var { content, className, mousePressed } = options;

  var elm = createElement(element, content);
  elm.id(eid);
  elm.class(className);
  elm.parent(parent);

  if (mousePressed) {
    elm.mousePressed(mousePressed);
  }

  return elm;
}
