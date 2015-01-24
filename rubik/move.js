(function() {

  function Move(face, turns) {
    this.face = face;
    this.turns = turns;
  }
  
  Move.prototype.axis = function() {
    return [-1, 1, 1, 2, 2, 0, 0][this.face];
  };

  Move.prototype.inverse = function() {
    if (this.turns === 2) {
      return this;
    } else {
      return new Move(this.face, -this.turns);
    }
  };

  Move.prototype.toString = function() {
    var faces = 'UDFBRL';
    var face = faces[this.face - 1];
    if (this.turns === 1) {
      return face;
    } else if (this.turns === 2) {
      return face + '2';
    } else {
      return face + "'";
    }
  };
  
  var _allMovesList;
  function allMoves() {
    // The moves are ordered in descending comfort.
    return _allMovesList.slice();
  }
  
  function movesToString(moves) {
    return moves.join(' ');
  }

  function parseMove(s) {
    if (s.length === 1) {
      var faces = ['U', 'D', 'F', 'B', 'R', 'L'];
      var face = faces.indexOf(s);
      if (face < 0) {
        throw new Error('Invalid move: ' + s);
      }
      return new Move(face+1, 1);
    } else if (s.length === 2) {
      var res = parseMove(s[0]);
      if (s[1] === '2') {
        res.turns = 2;
      } else if (s[1] === "'") {
        res.turns = -1;
      } else {
        throw new Error('Invalid move: ' + s);
      }
      return res;
    } else {
      throw new Error('Invalid move: ' + s);
    }
  }

  function parseMoves(s) {
    var parts = s.split(' ');
    var res = [];
    for (var i = 0, len = parts.length; i < len; ++i) {
      res[i] = parseMove(parts[i]);
    }
    return res;
  }
  
  function scrambleMoves(len) {
    var axis = -1;
    var moves = allMoves();
    var result = [];
    
    for (var i = 0; i < len; ++i) {
      // Pick a random move
      var moveIdx = Math.floor(Math.random() * moves.length);
      var move = moves[moveIdx];
      
      // Reset the moves and the axis if necessary.
      if (move.axis() !== axis) {
        axis = move.axis();
        moves = allMoves();
      }
      
      // Remove all moves which affect this face
      for (var j = 0; j < moves.length; ++j) {
        if (moves[j].face === move.face) {
          moves.splice(j, 1);
          --j;
        }
      }
      
      result[i] = move;
    }
    
    return result;
  }
  
  // Generate a list of every move, ordered by comfort.
  _allMovesList = parseMoves("R R' L L' U U' D D' R2 L2 U2 D2 F2 B2 F " +
    "F' B B'");

  if ('undefined' !== typeof window) {
    if (!window.puzzlejs) {
      window.puzzlejs = {};
    }
    if (!window.puzzlejs.rubik) {
      window.puzzlejs.rubik = {};
    }
    window.puzzlejs.rubik.Move = Move;
    window.puzzlejs.rubik.movesToString = movesToString;
    window.puzzlejs.rubik.parseMove = parseMove;
    window.puzzlejs.rubik.parseMoves = parseMoves;
    window.puzzlejs.rubik.scrambleMoves = scrambleMoves;
  }
  if ('undefined' !== typeof module) {
    if (!module.exports) {
      module.exports = {};
    }
    module.exports.Move = Move;
    module.exports.movesToString = movesToString;
    module.exports.parseMove = parseMove;
    module.exports.parseMoves = parseMoves;
    module.exports.scrambleMoves = scrambleMoves;
  }

})();
