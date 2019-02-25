//The order of number is generated by MathJax, in the future if we add new LATEX formula,
//THE ORDER MAY CHANGE!!!
var aboutList = ['MJXc-Node-9', //Eion
'MJXc-Node-19', //R
'MJXc-Node-20', //T
'MJXc-Node-22', //z
'MJXc-Node-23', //F
'MJXc-Node-29', //Ion Out
'MJXc-Node-30', //Ion In
'MJXc-Node-67', //Vrest
'MJXc-Node-78', //R
'MJXc-Node-79', //T
'MJXc-Node-80', //F
'MJXc-Node-87', //Pna MJXc-Node-142
'MJXc-Node-106', //Pcl MJXc-Node-161
'MJXc-Node-125', //Pk MJXc-Node-180
'MJXc-Node-93', //[Na]out
'MJXc-Node-148', //[Na]in
'MJXc-Node-112', //[Cl]out
'MJXc-Node-167', //[Cl]in
'MJXc-Node-130', //[K]out
'MJXc-Node-185', //[K]in
]

var aboutListDupl = [
  'MJXc-Node-142',
  'MJXc-Node-161',
  'MJXc-Node-180'
]

setTimeout(

  function() {
    for(let i=0;i<aboutList.length;i++) {
      document.querySelector('#aboutPage #'+aboutList[i]).classList.add('eqn')
      document.querySelector('#aboutPage #'+aboutList[i]).onmouseover = function() {eqnOver(this,true)};
      document.querySelector('#aboutPage #'+aboutList[i]).onmouseout = function() {eqnOut(this,true)};

      //Link the duplication to the first element
      if(i>=aboutList.indexOf('MJXc-Node-87') && i<=aboutList.indexOf('MJXc-Node-125')) {
        let j = i - aboutList.indexOf('MJXc-Node-87')
        let duplication = document.querySelector('#aboutPage #'+aboutList[i])
        document.querySelector('#aboutPage #'+aboutListDupl[j]).classList.add('eqn')
        document.querySelector('#aboutPage #'+aboutListDupl[j]).onmouseover = function() {eqnOver(duplication,true)};
        document.querySelector('#aboutPage #'+aboutListDupl[j]).onmouseout = function() {eqnOut(duplication,true)};
      }
      //

      document.querySelectorAll('#aboutPage table tr')[i].classList.add(aboutList[i])
      document.querySelectorAll('#aboutPage table tr')[i].classList.add('eqn')
      document.querySelectorAll('#aboutPage table tr')[i].onmouseover = function() {eqnOver(this,false)};
      document.querySelectorAll('#aboutPage table tr')[i].onmouseout = function() {eqnOut(this,false)};
    }
  }

  ,3500)

  function eqnOver(e,eqn) {
    // Input 1: HTML DOM element
    // Input 2: boolen

    if(eqn) {
      document.getElementsByClassName(e.id)[0].style.backgroundColor = "rgb(46, 204, 113)";
    } else if(!eqn) {

      checkDuplication(e,true)
      document.querySelector('#aboutPage #'+e.className.split(' ')[0]).style.backgroundColor = "rgb(46, 204, 113)";
    }
  }

  function eqnOut(e,eqn) {
    // Input 1: HTML DOM element
    // Input 2: boolen
    if(eqn) {
      document.getElementsByClassName(e.id)[0].style.backgroundColor = "";
    } else if(!eqn) {

      checkDuplication(e,false)
      document.querySelector('#aboutPage #'+e.className.split(' ')[0]).style.backgroundColor = "";
    }
  }

  function checkDuplication(e,option) {
    //Input 1: DOM element
    //Input 2: Boolean;
    //If true then add backgroundColor, false for remove backgroundColor

    var targetId = e.className.split(' ')[0];
    var i = aboutList.indexOf(targetId);
    if(i>=aboutList.indexOf('MJXc-Node-87') && i<=aboutList.indexOf('MJXc-Node-125')) { //Link the duplication to the first element
      let j = i - aboutList.indexOf('MJXc-Node-87')

      let color = (option) ? "rgb(46, 204, 113)" : ""
      document.querySelector('#aboutPage #'+aboutListDupl[j]).style.backgroundColor = color;
    }
  }