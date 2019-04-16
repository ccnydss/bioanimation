<!-- https://sourceforge.net/p/jsdoc/wiki/markdown_syntax/ -->
This is the documentation for the bioanimation code.

## JavaScript
------

#### Naming Rule
Style: **camelcase**

**Capital** first letter means **class**

**lowcase** first letter means **global function***

<br/>
#### Structure
------
![1](../img/file.png)
**index.html** --The main file that load all the JavaScript libraries, setting up basic HTML tabs

![1](../img/file.png)
**index.js** -- Use to generate different platform application (Window,Mac,Linux) using Electron.

![1](../img/folder.png) **js**

.....![2](../img/folder.png) **obj**

.......... ![3](../img/file.png)
**ALL THE JAVACRIPT FILE** -- <u>is explained in this documentation</u>

.....![2](../img/folder.png) **p5** p5.js library

.....![2](../img/folder.png) **seq** sequence preset event handler

.....![2](../img/folder.png) **tests** QUnit testing framework

.....![2](../img/file.png)
**about.js** -- Generate the about page content

.....![2](../img/file.png)
**browserDetection.js** -- Detection their browser version and computer platform information

.....![2](../img/file.png)
**helper.js** -- Global/Public functions that can be accessed anywhere

.....![2](../img/file.png)
**main.js** -- Main file that initialize the simulator environment

.....![2](../img/file.png)
**particleControls.js** -- Particle Controls UI onClick/onChange handler

.....![2](../img/file.png)
**sketchControls.js** -- UI resizing, and UI enable/disable event handler

.....![2](../img/file.png)
**versionDetection.js** -- Detection bioanimation version on computer platform application

<br/><br/><br/>
## CSS
------

#### Naming Rule
Style: **lowcase-lowcase**
<br/>
#### Structure
------
![1](../img/folder.png) **menu**

.....![2](../img/file.png)
**ALL THE CSS FILE** -- js/menu/ related css

![1](../img/file.png)
**button.css** -- All sims button goes here

![1](../img/file.png)
**etc.css** -- All uncategorized items goes here

![1](../img/file.png)
**general.css** -- All the HTML tag goes here

![1](../img/file.png)
**particles.css** -- js/obj/animation/particle.js

![1](../img/file.png)
**scrolls.css** -- All the HTML scroll goes here

![1](../img/file.png)
**sim-window.css** -- All the element append on the sim canvas goes here

![1](../img/file.png)
**simulatorDOM** -- All the element append on the sim canvas goes here

<br/><br/><br/>
## Set up instructions
------
Clone the repository, make sure you have the latest versions of NodeJS and NPM,
then run `npm install` inside the bioanimation directory.

You can run the application directly in the browser by opening `index.html`,
or as a desktop Electron application by running `npm run start` in the console.

<br/><br/><br/>
## Scripts
------
`npm run dist-all` will build Electron applications for Windows, Mac OS, and
Linux.

`npm run publish` requires a GitHub authentication token defined in an
environment variable `GH_TOKEN` that has repo access. This will build the
Electron application for all platforms and automatically upload them to
GitHub Releases.

`npm run docs` will generate the JSDoc documention and output the result in the
`docs/` directory.
