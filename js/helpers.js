function randomFromRanges(arrayOfRanges) {
  // Example input: [ [1, 2], [9, 8], [10, 15] ]
  // Example output: a random number between 1 and 2, OR, between 9 and 9, OR,
  //    between 10 and 15.
  var numOfRanges = arrayOfRanges.length;
  var selectedRange = floor(random(0, numOfRanges));
  var selectedChoices = arrayOfRanges[selectedRange];

  return random(selectedChoices[0], selectedChoices[1]);
}
