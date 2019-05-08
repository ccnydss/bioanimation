let nq1 = {
  content: `
Calculate the equilibrium potential for Na and K using the Nernst equation for the following conditions 

<table id='qtable' class='qtable'>
<tbody>
<tr>
<th>[Na]out</th>
<th>[Na]in</th>
<th>[K]out</th>
<th>[K]in</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>5</th>
<th>120</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>7.5</th>
<th>120</th>
</tr>

<tr>
<th>150</th>
<th>15</th>
<th>2.5</th>
<th>120</th>
</tr>
</tbody>
</table>

<p id='qtext2'>
These changes in [K]out concentration are real examples of pathological conditions that can lead to seizures and renal failure.
</p>
`,
type: "multiple",
choices: ["Ay", "Bee", "Sea"],
answer: 1
};

class Question {
    constructor(content, type, choices, answer) {
      this.content = content; 
      this.type = type; 
      this.choices = choices; 
      this.answer = answer;
      this.radio;
    }

    display(parentID) {
      document.getElementById(parentID).innerHTML = this.content;

      this.radio = createElement("div");
      this.radio.id("qchoices");
      this.radio.parent(parentID);
      
      for (var i = 0; i < this.choices.length; i++) {
        let optionContainer = createElement("div");
        // optionContainer.class("qcontainer");

        let option = createElement("input");
        option.attribute("type", "radio");
        option.attribute("value", i);
        option.attribute("name", "qradio-opt");
        option.id("qradio-" + i);
        option.parent(optionContainer);

        var qinst = this;
        option.mouseClicked(function() {
          qinst.checkAnswer(this.value());
        });

        let label = createElement("label", this.choices[i]);
        label.attribute("for", "qradio-" + i);
        label.parent(optionContainer);

        optionContainer.parent("qchoices");
      }
    }
    
    checkAnswer(input) {
      if (input != this.answer) {
        // console.log("Wrong!", input, this.answer);
        alert("Wrong!");
      }
    }
}

var questions = {
  Nernst: [new Question(nq1.content, nq1.type, nq1.choices, 1)],
  Goldman: []
};