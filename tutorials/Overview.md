# Application Overview

This is a web application built with [JavaScript]{@link https://w3schools.com/Js/},
[HTML]{@link https://w3schools.com/html/default.asp}, and
[CSS]{@link https://w3schools.com/css/default.asp}.

However, JavaScript alone was not enough. We use a library called
{@link https://p5js.org/|p5.js} which helps us create interactive animations on
the web page. Understanding how p5 works and how we use it is important for
understanding the application structure.

The last piece for understanding the application design is to understand
Object-Oriented Programming, or OOP. We try to use a OOP style to simplify the
architecture and logic of the whole app. In a sense, this means that each
part of the app is only concerned with itself -- other parts don't need to know
all the details about other parts, only how to use them.

To make this clearer, read these two (short) articles that are very good at
simply explaining OOP concept and principles:

* [OOP Explained Simply]{@link https://milessebesta.com/web-design/object-oriented-programming-explained-simply/}
* [OOP 4 Principles]{@link https://medium.freecodecamp.org/object-oriented-programming-concepts-21bb035f7260}

## Class Hierarchy
The {@link SequenceManager} class is the primary class.
