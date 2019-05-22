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

let gq1 = {
  content: `
  <section>
  Assume that in a neuron, the plasma membrane permeability values for potassium (K + ), sodium (Na + ),
  and Cl − are the following:
  p<sub>K</sub> = 1,
  p<sub>Na</sub> = 12,
  and p<sub>Cl</sub> = 0.5

  Based on physiological concentrations of K<sub>+</sub> , Na<sub>+</sub>, and Cl<sub>−</sub>
  determine the membrane potential in this neuron </section><section>2)
  Calculate the resting membrane potential under these conditions.

  Think about how these different conditions would affect normal cellular function.
  </section>

  <table>
  <tr>
  <th>PNa</th>
  <th>[Na]out</th>
  <th>[Na]in</th>
  <th>PK</th>
  <th>[K]out</th>
  <th>[K]in</th>
  </tr>

  <tr>
  <td>1</td>
  <td>150</td>
  <td>15</td>
  <td>200</td>
  <td>7.5</td>
  <td>120</td>
  </tr>

  <tr>
  <td>1</td>
  <td>150</td>
  <td>15</td>
  <td>400</td>
  <td>2.5</td>
  <td>120</td>
  </tr>

  <tr><td>1</td><td>150</td><td>15</td><td>100</td><td>5</td><td>120</td></tr>
  <tr><td>1</td><td>150</td><td>15</td><td>20</td><td>7.5</td><td>120</td></tr>
  <tr><td>1</td><td>150</td><td>15</td><td>40</td><td>5</td><td>120</td></tr><tr>
  <td>1</td><td>150</td><td>15</td><td>10</td><td>2.5</td><td>120</td></tr>
  </table>
  `,
  type: "multiple",
  choices: ["Ex", "Why", "Zee"],
  answer: 2
}

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
      } else {
        alert("Correct!");
      }
    }
}

var questions = {
  Nernst: [new Question(nq1.content, nq1.type, nq1.choices, 1)],
  Goldman: [new Question(gq1.content, gq1.type, gq1.choices, 2)]
};
