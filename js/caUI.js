// mymatrix.js
//
// simulates a simple grid of clickable widgets (a la matrixctrl)
//
// rld, 5.04
//

autowatch = 1;

// inlets and outlets
inlets = 1;
outlets = 1;

// global variables
var sqSize = 32;

// initialize state array
var state = new Array();
for (var i = 0; i < sqSize; i++) {
  state[i] = new Array();
  for (j = 0; j < sqSize; j++) {
    state[i][j] = 0;
  }
}

// set up jsui defaults to 2d
sketch.default2d();

// initialize graphics
draw();
refresh();

// draw -- main graphics function
function draw() {
  with (sketch) {
    // set how the polygons are rendered
    glclearcolor(0); // set the clear color
    glclear(); // erase the background
    var colstep = 2 / sqSize; // how much to move over per column
    var rowstep = 2 / sqSize; // how much to move over per row
    for (
      var i = 0;
      i < sqSize;
      i++ // iterate through the columns
    ) {
      for (
        var j = 0;
        j < sqSize;
        j++ // iterate through the rows
      ) {
        glcolor(255, 255, 255);
        glrect(
          i * colstep - 1.0,
          1.0 - (j+1) * rowstep,
          i * colstep - 1.0 + 2 / sqSize,
          1.0 - (j+1) * rowstep + 2 / sqSize
        );
        if (state[i][j]) {
          // set 'on' color
          glcolor(255, 255, 255);
        } // set 'off' color (midway between vbrgb and vfrgb)
        else {
          glcolor(0);
        }
        glrect(
          i * colstep - 1.0 + 0.002,
          1.0 - (j+1) * rowstep + 0.002,
          i * colstep - 1.0 + 2 / sqSize - 0.002,
          1.0 - (j+1) * rowstep + 2 / sqSize - 0.002
        );
      }
    }
  }
}

// bang -- draw and refresh display
function bang() {
  draw();
  refresh();
}

function output() {
  for (var i = 0; i < sqSize; i++) {
    for (j = 0; j < sqSize; j++) {
      outlet(0, i, j, state[i][j]);
    }
  }
}

// list -- update our state to respond to a change from Max
function list(v) {
  if (arguments.length == 3) {
    // bail if incorrect number of arguments
    state[arguments[0]][arguments[1]] = arguments[2]; // update our internal state based on the list
  }
  bang(); // draw and refresh display
}

// clear -- wipe the state clean
function clear() {
  for (var i = 0; i < sqSize; i++) {
    for (var j = 0; j < sqSize; j++) {
      state[i][j] = 0; // wipe the state
    }
  }
  bang(); // draw and refresh display
}

// onresize -- deal with a resized jsui box
function onresize(w, h) {
  bang(); // draw and refresh display
}
onresize.local = 1; // make function private to prevent triggering from Max

// onclick -- deal with mouse click event
function onclick(x, y) {
  var worldx = sketch.screentoworld(x, y)[0];
  var worldy = sketch.screentoworld(x, y)[1];

  var colwidth = 2 / sqSize; // width of a column, in world coordinates
  var rowheight = 2 / sqSize; // width of a row, in world coordinates

  var x_click = Math.floor((worldx + 1) / colwidth); // which column we clicked
  var y_click = Math.floor((1 - worldy) / rowheight); // which row we clicked

  state[x_click][y_click] = !state[x_click][y_click]; // flip the state of the clicked point

  bang(); // draw and refresh display
}
onclick.local = 1; // make function private to prevent triggering from Max
