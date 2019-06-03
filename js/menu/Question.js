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
  Nernst: [
    new Question(nq1.content, nq1.type, nq1.choices, nq1.answer),
    new Question(nq2.content, nq2.type, nq2.choices, nq2.answer)
  ],
  Goldman: [
    new Question(gq1.content, gq1.type, gq1.choices, gq1.answer),
    new Question(gq2.content, gq2.type, gq2.choices, gq2.answer)
  ]
};
