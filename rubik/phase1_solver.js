// A Solver keeps track of context for a depth-first search.
function Solver(heuristic, moves, cb, deadline, depth) {
  this.heuristic = heuristic;
  this.moves = moves;
  this.cb = cb;
  this.deadline = deadline;
  this.depth = depth;
  
  // this.basis caches 18 Move objects to avoid allocation.
  this.basis = [];
  for (var i = 0; i < 18; ++i) {
    this.basis[i] = new Move(i);
  }
  
  // this.preAllocCubes caches a cube per level of depth in the search.
  this.preAllocCubes = [];
  for (var i = 0; i < depth; ++i) {
    this.preAllocCubes[i] = new Phase1Cube();
  }
  
  // this.solution is used to track the current solution; using this allows us
  // to avoid memory allocation in some browsers.
  this.solution = [];
  for (var i = 0; i < depth; ++i) {
    this.solution[i] = 0;
  }
}

// solve finds solutions for the cube.
Solver.prototype.solve = function(cube) {
  return this._search(cube, 0, 0);
}

Solver.prototype._search = function(cube, depth, lastFace) {
  if (depth === this.depth) {
    if (cube.anySolved()) {
      if (this._expired()) {
        return false;
      }
      return this.cb(this.solution.slice(), cube.copy());
    }
    return true;
  } else if (this.heuristic.lowerBound(cube) > this.depth - depth) {
    return true;
  }

  var newCube = this.preAllocCubes[depth];
  for (var i = 0; i < 18; ++i) {
    var face = (i % 6) + 1;
    if (face === lastFace) {
      continue;
    }
    
    // Get the cube which results from applying the given move.
    var move = this.basis[i];
    newCube.set(cube);
    newCube.move(move, this.moves);
    
    // Recurse one level deeper, setting the move in the solution buffer.
    this.solution[depth] = move;
    if (!this._search(newCube, depth+1, face)) {
      return false;
    }
    
    // this._expired allocates memory and thus consumes time. Luckily, short
    // circuit evaluation makes this a three-liner.
    if (depth >= 7 && this._expired()) {
      return false;
    }
  }

  return true;
};

Solver.prototype._expired = function() {
  return new Date().getTime() > this.deadline;
};

// solvePhase1 uses iterative deepening to solve the cube.
// The cb argument is a callback which receives two arguments, a solution and a
// Phase1Cube, for each solution. If the callback returns true, the search will
// continue. If it returns false, the search will stop.
// The timeout argument represents the number of milliseconds after which the
// solver should stop. This is 1000000 by default.
function solvePhase1(cube, heuristic, moves, cb, timeout) {
  var deadline = new Date().getTime() + (timeout || 1000000);
  var depth = 0;
  while (true) {
    var solver = new Solver(heuristic, moves, cb, deadline, depth);
    if (!solver.solve(cube)) {
      return;
    }
    ++depth;
  }
}

exports.solvePhase1 = solvePhase1;
