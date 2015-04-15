// xCornerIndices are the indexes of the corners on the Y axis cube which
// correspond to the corners on the X axis cube. An index in this array
// corresponds to the physical slot in the X axis cube. A value in this array
// corresponds to the physical slot in the Y axis cube.
var xCornerIndices = [1, 3, 0, 2, 5, 7, 4, 6]

// xEdgeIndices are the indexes of the edges on the Y axis cube which correspond
// to edges on the X axis cube. An index in this array corresponds to the
// physical slot in the X axis cube. A value in this array corresponds to the
// physical slot in the Y axis cube.
var xEdgeIndices = [3, 0, 1, 2, 10, 4, 9, 6, 7, 8, 11, 5]

// xMoveTranslation maps moves from the Y axis phase-1 cube to moves on the X
// axis cube. The mapping is: F->F, B->B, U->R, D->L, L->U, R->D.
// For example, doing U on a Y-axis cube is like doing R on the X-axis version
// of that cube.
// This mapping is kind of like doing a "z" rotation before the move.
var xMoveTranslation = [4, 5, 2, 3, 1, 0, 10, 11, 8, 9, 7, 6, 16, 17, 14, 15,
  13, 12];

// zCornerIndices are like xCornerIndices but for the Z axis cube.
var zCornerIndices = [2, 3, 6, 7, 0, 1, 4, 5]

// zEdgeIndices are like xEdgeIndices but for the Z axis cube.
var zEdgeIndices = [2, 11, 8, 10, 3, 1, 0, 5, 6, 4, 9, 7]

// zMoveTranslation is like xMoveTranslation, but it's for doing an "x" rotation
// before applying a move. The mapping is: R->R, L->L, F->U, B->D, U->B, D->F.
var zMoveTranslation = [3, 2, 0, 1, 4, 5, 9, 8, 6, 7, 10, 11, 15, 14, 12, 13,
  16, 17];

// A Phase1Cube is an efficient way to represent the parts of a cube which
// matter for the first phase of Kociemba's algorithm.
// The FB edge orientation can be used for both Y and X phase-1 goals, and the
// UD edge orientation can be used for the Z phase-1 goal. Thus, no RL edge
// orientations are needed.
function Phase1Cube(cc) {
  if ('undefined' !== typeof cc) {
    var xzCO = encodeXZCO(cc.corners);
    
    this.xCO = xzCO[0];
    this.yCO = encodeCO(cc.corners);
    this.zCO = xzCO[1];
    
    this.fbEO = encodeEO(cc.edges);
    this.udEO = encodeUDEO(cc.edges);
    
    var msSlice = encodeMSSlice(cc.edges);
    this.mSlice = msSlice[0];
    this.eSlice = encodeESlice(cc.edges);
    this.sSlice = msSlice[1];
  } else {
    // These are the initial corner orientations.
    this.xCO = 1093;
    this.yCO = 1093;
    this.zCO = 1093;
  
    // These are the initial edge orientations.
    this.fbEO = 0;
    this.udEO = 0;
  
    // These are the initial slice permutations.
    this.mSlice = 220;
    this.eSlice = 220;
    this.sSlice = 220;
  }
}

// anySolved returns true if the phase-1 state is solved along any axis.
Phase1Cube.prototype.anySolved = function() {
  if (this.xCO === 1093 && this.mSlice === 220 && this.fbEO === 0) {
    return true;
  } else if (this.yCO === 1093 && this.eSlice === 220 && this.fbEO === 0) {
    return true;
  } else if (this.zCO === 1093 && this.sSlice === 220 && this.udEO === 0) {
    return true;
  }
  return false;
};

// copy returns a copy of the Phase1Cube.
Phase1Cube.prototype.copy = function() {
  var res = Object.create(Phase1Cube.prototype);

  res.xCO = this.xCO;
  res.yCO = this.yCO;
  res.zCO = this.zCO;
  res.fbEO = this.fbEO;
  res.udEO = this.udEO;
  res.mSlice = this.mSlice;
  res.eSlice = this.eSlice;
  res.sSlice = this.sSlice;

  return res;
};

// move applies a move to the Phase1Cube.
Phase1Cube.prototype.move = function(move, table) {
  var m = move.number;
  
  // Apply the move to the y-axis cube.
  this.yCO = table.co[this.yCO*18 + m];
  this.fbEO = table.eo[this.fbEO*18 + m];
  this.eSlice = table.slice[this.eSlice*18 + m];
  
  // Apply the move to the z-axis cube.
  var zMove = zMoveTranslation[m];
  this.zCO = table.co[this.zCO*18 + zMove];
  this.udEO = table.eo[this.udEO*18 + zMove];
  this.sSlice = table.slice[this.sSlice*18 + zMove];
  
  // Apply the move to the x-axis cube.
  var xMove = xMoveTranslation[m];
  this.xCO = table.co[this.xCO*18 + xMove];
  this.mSlice = table.slice[this.mSlice*18 + xMove];
};

// set updates this object's fields to reflect a given Phase1Cube.
Phase1Cube.prototype.set = function(obj) {
  this.xCO = obj.xCO;
  this.yCO = obj.yCO;
  this.zCO = obj.zCO;
  this.fbEO = obj.fbEO;
  this.udEO = obj.udEO;
  this.mSlice = obj.mSlice;
  this.eSlice = obj.eSlice;
  this.sSlice = obj.sSlice;
};

// solved returns an array with three booleans, [x, y, z], which indicates
// whether any axis is solved for phase-1.
Phase1Cube.prototype.solved = function() {
  var x = true;
  var y = true;
  var z = true;
  if (this.xCO !== 1093) {
    x = false;
  } else if (this.mSlice !== 220) {
    x = false;
  } else if (this.fbEO !== 0) {
    x = false;
  }
  if (this.yCO !== 1093) {
    y = false;
  } else if (this.eSlice !== 220) {
    y = false;
  } else if (this.fbEO !== 0) {
    y = false;
  }
  if (this.zCO !== 1093) {
    z = false;
  } else if (this.sSlice !== 220) {
    z = false;
  } else if (this.udEO !== 0) {
    z = false;
  }
  return [x, y, z];
};

// xEO returns the fbEO, translated for the X axis cube.
Phase1Cube.prototype.xEO = function() {
  var res = 0;
  
  // Translate the EO bitmap, noting that xEdgeIndices[10] is 11 and is thus
  // never set in the FB bitmap.
  var parity = 0;
  for (var i = 0; i < 10; ++i) {
    var idx = xEdgeIndices[i];
    if ((this.fbEO & (1 << idx)) !== 0) {
      res |= 1 << i;
      parity ^= 1;
    }
  }
  
  // If the last thing in the translated bitmap would be a 1, flip the parity.
  if ((this.fbEO & (1 << xEdgeIndices[11])) !== 0) {
    parity ^= 1;
  }
  
  // If there is parity, then the missing element (i.e. #10) is 1.
  res |= parity << 10;
  
  return res;
};

// Phase1Moves is a table containing the necessary data to efficiently perform
// moves on a Phase1Cube.
// Note that only one move table is needed for all 3 axes (i.e. all three
// phase-1 goals). Thus, the move tables apply directly to the Y-oriented
// phase-1 goal. Moves much be translated for the X-oriented and Z-oriented
// goals.
function Phase1Moves() {
  this.slice = new Int16Array(495 * 18);
  this.eo = new Int16Array(2048 * 18);
  this.co = new Int16Array(2187 * 18);
  
  this._generateCO();
  this._generateEO();
  this._generateESlice();
}

Phase1Moves.prototype._generateCO = function() {
  for (var i = 0; i < 2187*18; ++i) {
    this.co[i] = -1;
  }
  
  for (var i = 0; i < 2187; ++i) {
    var corners = decodeCO(i);
    for (var move = 0; move < 18; ++move) {
      if (this.co[i*18 + move] >= 0) {
        continue;
      }
      
      // Set the end state in the table.
      var aCase = corners.copy();
      aCase.move(new Move(move));
      var endState = encodeCO(aCase);
      this.co[i*18 + move] = endState;
      
      // Set the inverse in the table.
      this.co[endState*18 + new Move(move).inverse().number] = i;
    }
  }
};

Phase1Moves.prototype._generateEO = function() {
  for (var i = 0; i < 2048*18; ++i) {
    this.eo[i] = -1;
  }
  
  for (var i = 0; i < 2048; ++i) {
    var edges = decodeEO(i);
    for (var move = 0; move < 18; ++move) {
      if (this.eo[i*18 + move] >= 0) {
        continue;
      }
      
      // Set the end state in the table.
      var aCase = edges.copy();
      aCase.move(new Move(move));
      var endState = encodeEO(aCase);
      this.eo[i*18 + move] = endState;
      
      // Set the inverse in the table.
      this.eo[endState*18 + new Move(move).inverse().number] = i;
    }
  }
};

Phase1Moves.prototype._generateESlice = function() {
  for (var i = 0; i < 495*18; ++i) {
    this.slice[i] = -1;
  }
  
  // Generate the E slice cases by looping through all the possible ways to
  // choose 4 elements from a set of 12.
  var sliceCase = 0;
  for (var w = 0; w < 12; ++w) {
    for (var x = w + 1; x < 12; ++x) {
      for (var y = x + 1; y < 12; ++y) {
        for (var z = y + 1; z < 12; ++z) {
          // Create a state which has bogus edges at the slice indices.
          var state = new Edges();
          state.edges[w].piece = -1;
          state.edges[x].piece = -1;
          state.edges[y].piece = -1;
          state.edges[z].piece = -1;
          for (var move = 0; move < 18; ++move) {
            if (this.slice[sliceCase*18 + move] >= 0) {
              continue;
            }
            
            // Set the end state in the table.
            var aCase = state.copy();
            aCase.move(new Move(move));
            var encoded = encodeBogusSlice(aCase);
            this.slice[sliceCase*18 + move] = encoded;
            
            // Set the inverse in the table.
            this.slice[encoded*18 + new Move(move).inverse().number] =
              sliceCase;
          }
          ++sliceCase;
        }
      }
    }
  }
};

// decodeCO generates Corners which represent a given CO case.
function decodeCO(co) {
  var c = new Corners();
  
  // Compute the orientations of the first 7 corners.
  var scaler = 1;
  for (var x = 0; x < 7; ++x) {
    c.corners[x].orientation = Math.floor(co / scaler) % 3;
    scaler *= 3;
  }
  
  // Compute the last corner's orientation.
  // The way this works is based on the fact that a sune combo which twists two
  // adjacent corners is all that is necessary to generate any corner
  // orientation case.
  var ordering = [0, 1, 5, 4, 6, 2, 3, 7];
  var orientations = [];
  for (var i = 0; i < 8; ++i) {
    orientations[i] = c.corners[ordering[i]].orientation;
  }
  for (var i = 0; i < 7; ++i) {
    var thisOrientation = orientations[i];
    var nextOrientation = orientations[i+1];
    // Twist thisOrientation to be solved, affecting the next corner in the
    // sequence.
    if (thisOrientation === 2) {
      // y -> x, x -> z, z -> y
      orientations[i+1] = (nextOrientation + 2) % 3;
    } else if (thisOrientation === 0) {
      // z -> x, x -> y, y -> z
      orientations[i+1] = (nextOrientation + 1) % 3;
    }
  }
  // The twist of the last corner is the inverse of what it should be in the
  // scramble.
  if (orientations[7] === 0) {
    c.corners[7].orientation = 2;
  } else if (orientations[7] === 2) {
    c.corners[7].orientation = 0;
  }
  
  return c;
}

// decodeEO generates Edges which represent a given EO case.
function decodeEO(eo) {
  var edges = new Edges();
  var parity = false;
  for (var x = 0; x < 11; ++x) {
    if ((eo & (1 << x)) !== 0) {
      parity = !parity;
      edges.edges[x].flip = true;
    }
  }
  edges.edges[11].flip = parity;
  return edges;
}

// encodeBogusSlice encodes a slice permutation case, treating pieces with
// values of "-1" as E slice edges.
function encodeBogusSlice(edges) {
  var list = [];
  for (var i = 0; i < 12; ++i) {
    list[i] = (edges.edges[i].piece === -1);
  }
  return perms.encodeChoose(list);
}

// encodeCO encodes the CO case of a given set of Corners.
function encodeCO(c) {
  var res = 0;
  var scaler = 1;
  for (var i = 0; i < 7; ++i) {
    res += scaler * c.corners[i].orientation;
    scaler *= 3;
  }
  return res;
}

// encodeEO encodes the EO case of a given set of Edges.
function encodeEO(e) {
  var res = 0;
  for (var i = 0; i < 11; ++i) {
    if (e.edges[i].flip) {
      res |= (1 << i);
    }
  }
  return res;
}

// encodeESlice encodes the E slice of a given set of Edges.
function encodeESlice(edges) {
  var list = [];
  for (var i = 0; i < 12; ++i) {
    var piece = edges.edges[i].piece;
    if (piece === 1 || piece === 3 || piece === 7 || piece === 9) {
      list[i] = true;
    } else {
      list[i] = false;
    }
  }
  return perms.encodeChoose(list);
}

// encodeMSSlice encodes the M and S slices of Edges.
function encodeMSSlice(edges) {
  var mChoice = [];
  var sChoice = [];
  for (var i = 0; i < 12; ++i) {
    var idx = xEdgeIndices[i];
    var p = edges.edges[idx].piece;
    if (p === 0 || p === 2 || p === 6 || p === 8) {
      mChoice[i] = true;
    } else {
      mChoice[i] = false;
    }
  }
  for (var i = 0; i < 12; ++i) {
    var idx = zEdgeIndices[i];
    var p = edges.edges[idx].piece;
    if (p === 4 || p === 5 || p === 10 || p === 11) {
      sChoice[i] = true;
    } else {
      sChoice[i] = false;
    }
  }
  return [perms.encodeChoose(mChoice), perms.encodeChoose(sChoice)];
}

// encodeUDEO encodes the UD EO case of Edges.
function encodeUDEO(edges) {
  var res = 0;
  for (var i = 0; i < 11; ++i) {
    var idx = zEdgeIndices[i];
    var edge = edges.edges[idx];
    var flip = edge.flip;
    var p = edge.piece
    if (p === 0 || p === 2 || p === 6 || p === 8) {
      // This is an M slice edge piece, so it changes orientation if it
      // was on the S slice or the E slice.
      if (idx !== 0 && idx !== 2 && idx !== 6 && idx !== 8) {
        flip = !flip;
      }
    } else {
      // This is an E or S slice edge, so it changes orientation if it
      // was on the M slice.
      if (idx === 0 || idx === 2 || idx === 6 || idx === 8) {
        flip = !flip
      }
    }
    if (flip) {
      res |= 1 << i;
    }
  }
  return res;
}

// encodeXZCO encodes the CO of Corners on the X and Z axes.
function encodeXZCO(corners) {
  var x = [];
  var z = [];
  var xVal = 0;
  var zVal = 0;
  
  // For each corner, find the direction of the x and z stickers.
  for (var i = 0; i < 8; ++i) {
    var corner = corners.corners[i];
    
    // If the corner was in its original slot, here's what the directions
    // would be.
    var o = corner.orientation;
    if (o === 0) {
      x[i] = 2;
      z[i] = 1;
    } else if (o === 1) {
      x[i] = 0;
      z[i] = 2;
    } else {
      x[i] = 1;
      z[i] = 0;
    }

    // If it takes an odd number of quarter turns to move the corner back to
    // its original slot, swap x and z.
    var d = (corner.piece ^ i) & 7;
    if (d === 1 || d === 2 || d === 4 || d === 7) {
      var oldX = x[i];
      x[i] = z[i];
      z[i] = oldX;
    }
  }
  
  // Add the information together to generate the final values.
  var scaler = 1;
  for (var i = 0; i < 7; ++i) {
    var xDirection = x[xCornerIndices[i]];
    if (xDirection === 1) {
      xDirection = 0;
    } else if (xDirection === 0) {
      xDirection = 1;
    }
    xVal += scaler * xDirection;
    
    var zDirection = z[zCornerIndices[i]];
    if (zDirection === 1) {
      zDirection = 2;
    } else if (zDirection === 2) {
      zDirection = 1;
    }
    zVal += scaler * zDirection;
    
    scaler *= 3;
  }
  
  return [xVal, zVal];
}

exports.Phase1Cube = Phase1Cube;
exports.Phase1Moves = Phase1Moves;
