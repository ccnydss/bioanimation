/*I Tried working on the questions and answers*/

/*Not finished. Still trying to understand the p5.js library so my code might be very ineffecient*/

var answer1;
var answer2;
var answer3;
var answer4;
function setup() {
  createCanvas(windowWidth, windowHeight);
  let q = 'Nernest Question 2:';
  textSize(24);
  text(q,10,30);
  let s = 'Using a microelectrode, you measure this axon’s resting membrane potential at -90mV. Is this axon permeable to only K+? If not, what else might it be permeable to?';
  textSize(18);
  text (s,10, 40, width,height);
 createAnswers()
}

function createAnswers()
{
  var answerList = []
  var answerArray = ["The resting membrane potential is not equal to Ek, so it is not only permeable to K+ at rest. It might also be permeable to Na+ or Ca++.", "answer2", "answer3","answer4"];
  var initialPosition =120;
for(let i=0;i<answerArray.length; i++)
{
  answerList[i] = createRadio();
  answerList[i].option(answerArray[i])
  answerList[i].position(10,initialPosition)
  initialPosition = initialPosition+40;
}

}
// //) Using a microelectrode, you measure this axon’s resting membrane potential at -90mV. Is this axon permeable to only K+? If not, what else might it be permeable to?
// (Answer: The resting membrane potential is not equal to Ek, so it is not only permeable to K+ at rest. It might also be permeable to Na+ or Ca++).
