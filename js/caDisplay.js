// mymatrix.js
//
// simulates a simple grid of clickable widgets (a la matrixctrl)
//
// rld, 5.04
//

autowatch = 1;

// inlets and outlets
inlets = 1;
outlets = 2;

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
          1.0 - (j + 1) * rowstep,
          i * colstep - 1.0 + 2 / sqSize,
          1.0 - (j + 1) * rowstep + 2 / sqSize
        );
        if (state[i][j] == 1) {
          // set alive color
          glcolor(255, 255, 255);
        } else if (state[i][j] == 2) {
          // set dying color
          glcolor(128, 0, 128);
        } else {
          // set 'off' color
          glcolor(0);
        }
        glrect(
          i * colstep - 1.0 + 0.002,
          1.0 - (j + 1) * rowstep + 0.002,
          i * colstep - 1.0 + 2 / sqSize - 0.002,
          1.0 - (j + 1) * rowstep + 2 / sqSize - 0.002
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
      outlet(0, i, j, state[i][j]);
    }
  }
}

// list -- update our state to respond to a change from Max
function update(i, j, s) {
  state[i][j] = s;
}

function conwayIterate() {
  //Copy Array
  var storeCells = new Array();
  for (var i = 0; i < sqSize; i++) {
    storeCells[i] = new Array();
    for (var j = 0; j < sqSize; j++) {
      storeCells[i][j] = state[i][j];
    }
  }

  //Perform Rule Checks
  for (var i = 0; i < sqSize; i++) {
    for (var j = 0; j < sqSize; j++) {
      if (state[i][j] == 1) {
        if (checkNeighbours(i, j) < 2) {
          storeCells[i][j] = 0;
        } else if (checkNeighbours(i, j) > 3) {
          storeCells[i][j] = 0;
        }
      }
      if (state[i][j] == 0) {
        if (checkNeighbours(i, j) == 3) {
          storeCells[i][j] = 1;
        }
      }
    }
  }

  //Replace original state with new values
  for (var i = 0; i < sqSize; i++) {
    for (var j = 0; j < sqSize; j++) {
      state[i][j] = storeCells[i][j];
    }
  }

  bang();
}

function brianIterate() {
  //Copy Array
  var storeCells = new Array();
  for (var i = 0; i < sqSize; i++) {
    storeCells[i] = new Array();
    for (var j = 0; j < sqSize; j++) {
      storeCells[i][j] = state[i][j];
    }
  }

  //Perform Rule Checks
  for (var i = 0; i < sqSize; i++) {
    for (var j = 0; j < sqSize; j++) {
      if (state[i][j] == 1) {
        storeCells[i][j] = 2;
      } else if (state[i][j] == 2) {
        storeCells[i][j] = 0;
      } else if (state[i][j] == 0) {
        if (checkNeighbours(i, j) == 2) {
          storeCells[i][j] = 1;
        }
      }
    }
  }

  //Replace original state with new values
  for (var i = 0; i < sqSize; i++) {
    for (var j = 0; j < sqSize; j++) {
      state[i][j] = storeCells[i][j];
    }
  }

  bang();
}

function checkNeighbours(i, j) {
  var neighbours = 0;
  if (i > 0) {
    //Top Left
    if (j < 32) {
      if (state[i - 1][j + 1] == 1) {
        neighbours++;
      }
    }
    //Left
    if (state[i - 1][j] == 1) {
      neighbours++;
    }
    //Bottom Left
    if (j > 0) {
      if (state[i - 1][j - 1] == 1) {
        neighbours++;
      }
    }
  }
  if (i < 31) {
    if (j < 32) {
      //Top Right
      if (state[i + 1][j + 1] == 1) {
        neighbours++;
      }
    }
    //Right
    if (state[i + 1][j] == 1) {
      neighbours++;
    }
    if (j > 0) {
      //Bottom Right
      if (state[i + 1][j - 1] == 1) {
        neighbours++;
      }
    }
  }
  if (j > 0) {
    //Below
    if (state[i][j - 1] == 1) {
      neighbours++;
    }
  }
  if (j < 32) {
    //Above
    if (state[i][j + 1] == 1) {
      neighbours++;
    }
  }
  //Up and down
  return neighbours;
}

function out() {
	
  for (var i = 0; i < sqSize; i++) {
    for (var j = 1; j < sqSize + 1; j++) {
      if (state[i][j] == 1) {
        outlet(0, i);
        outlet(1, j);
      }
    }
  }

}

// clear -- wipe the state clean
function clear() {
  for (var i = 0; i < sqSize; i++) {
    for (var j = 1; j < sqSize + 1; j++) {
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
