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

// https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
function getStyle(elm, style) {
  // usage: obtain the dimension of a DOM element
  // input: DOM element
  // output: int,
  //    between 10 and 15.

  var elmDim, elmMargin;

  switch(style) {
    case "height":
    if(document.all) {// IE
      elmDim = elm.currentStyle.height;
      elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
      return (elmHeight+elmMargin);
    } else {// Mozilla
      elmDim = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }

    return (elmDim+elmMargin);
    break;

    case "width":
    if(document.all) {// IE
      elmDim = elm.currentStyle.width;
      elmMargin = parseInt(elm.currentStyle.marginLeft, 10) + parseInt(elm.currentStyle.marginRight, 10);
    } else {// Mozilla
      elmDim = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('width'));
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-left')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-right'));
    }
    return (elmDim+elmMargin);
    break;
  }
}

function swapElements(p51, p52) {
    // Convert the p5 objects to their HTML DOMs
    var obj1 = p51;
    var obj2 = p52.elt;

    // create marker element and insert it where obj1 is
    var temp = document.createElement("div");
    obj1.parentNode.insertBefore(temp, obj1);

    // move obj1 to right before obj2
    obj2.parentNode.insertBefore(obj1, obj2);

    // move obj2 to right before where obj1 used to be
    temp.parentNode.insertBefore(obj2, temp);

    // remove temporary marker node
    temp.parentNode.removeChild(temp);

    if (helpPage.style.display == "flex") {
      setTimeout(function () {
    help.clear()
    help.initialize()
  }, 100);
    }
}

function helpPageScript() {
  // onclick event trigger by helpPage
  var helpPage = document.getElementById("helpPage");
  if (helpPage.style.display == "none") {
    // alert("yes")
    helpPage.style.display = "flex";
    help.clear()
    help.initialize()
  } else {
    // alert("no")
    helpPage.style.display = "none";
    help.clear()
  }
}

// https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
