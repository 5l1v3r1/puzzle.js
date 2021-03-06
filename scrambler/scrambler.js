var scramblers = null;

function allPuzzles() {
  if (scramblers === null) {
    createScramblers();
  }

  var res = [];
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    res[i] = scramblers[i].name;
  }
  return res;
}

function createScramblers() {
  scramblers = [
    {
      name: "2x2x2",
      scramblers: [
        {
          f: pocketState,
          moves: false,
          name: "State"
        },
        {
          f: pocketOptState,
          moves: false,
          name: "Optimal"
        },
        {
          f: pocketMoves,
          moves: true,
          name: "Moves"
        }
      ]
    },
    {
      name: "3x3x3",
      scramblers: [
        {
          f: rubikState,
          moves: false,
          name: "State"
        },
        {
          f: rubikMoves,
          moves: true,
          name: "Moves"
        },
        {
          f: rubikZBLL,
          moves: false,
          name: "ZBLL"
        },
        {
          f: rubikLastLayer,
          moves: false,
          name: "Last Layer"
        },
        {
          f: rubikCorners,
          moves: false,
          name: "Corners"
        },
        {
          f: rubikEdges,
          moves: false,
          name: "Edges"
        },
        {
          f: rubik2GLL,
          moves: false,
          name: "2-Gen LL"
        },
      ]
    },
    {
      name: "4x4x4",
      scramblers: [
        {
          f: wcaMoves4x4,
          moves: true,
          name: "WCA Moves"
        }
      ]
    },
    {
      name: "5x5x5",
      scramblers: [
        {
          f: wcaMoves5x5,
          moves: true,
          name: "WCA Moves"
        }
      ]
    },
    {
      name: "6x6x6",
      scramblers: [
        {
          f: wcaMoves6x6,
          moves: true,
          name: "WCA Moves"
        }
      ]
    },
    {
      name: "7x7x7",
      scramblers: [
        {
          f: wcaMoves7x7,
          moves: true,
          name: "WCA Moves"
        }
      ]
    },
    {
      name: "Skewb",
      scramblers: [
        {
          f: skewbState,
          moves: false,
          name: "State"
        },
        {
          f: skewbMoves,
          moves: true,
          name: "Moves"
        },
        {
          f: skewbCenters,
          moves: false,
          name: "Centers"
        }
      ]
    },
    {
      name: "Megaminx",
      scramblers: [
        {
          f: megaminx.pochmannScramble,
          moves: true,
          name: "Moves"
        }
      ]
    },
    {
      name: "Pyraminx",
      scramblers: [
        {
          f: pyraminxState,
          moves: false,
          name: "State"
        }
      ]
    }
  ];
}

function generateScramble(puzzle, scrambler, moves) {
  if (scramblers === null) {
    createScramblers();
  }

  // Find the info for the scrambler.
  var info = null;
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    if (scramblers[i].name === puzzle) {
      var subs = scramblers[i].scramblers;
      for (var j = 0, len1 = subs.length; j < len1; ++j) {
        if (subs[j].name === scrambler) {
          info = subs[j];
          break;
        }
      }
    }
  }

  if (info === null) {
    throw new Error('unknown scrambler: ' + puzzle + '/' + scrambler);
  }
  if (info.moves) {
    return info.f(moves);
  } else {
    return info.f();
  }
}

function scramblersForPuzzle(puzzle) {
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    if (scramblers[i].name === puzzle) {
      var res = [];
      var subs = scramblers[i].scramblers;
      for (var j = 0, len1 = subs.length; j < len1; ++j) {
        res[j] = {moves: subs[j].moves, name: subs[j].name};
      }
      return res;
    }
  }
  throw new Error('unknown puzzle: ' + puzzle);
}

exports.allPuzzles = allPuzzles;
exports.generateScramble = generateScramble;
exports.scramblersForPuzzle = scramblersForPuzzle;
