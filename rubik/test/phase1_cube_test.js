var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testPhase1Conversion() {
  var moves = new rubik.Phase1Moves();
  var goodCube = new rubik.Phase1Cube();
  var checkCube = new rubik.CubieCube();

  // Apply a scramble to both a Phase1Cube and a CubieCube. Make sure the result
  // is the same.
  var scramble = rubik.parseMoves("L R2 B2 F2 L2 U' B2 F U R2 F' L2 R' B' F2 " +
    "D2 R U' L' R U2 F2 D U' R2 U B2 F D U");
  assert.deepEqual(goodCube, new rubik.Phase1Cube(checkCube),
    "Initial cubes do not match.");
  for (var i = 0, len = scramble.length; i < len; ++i) {
    var move = scramble[i];
    goodCube.move(move, moves);
    checkCube.move(move);
    assert.deepEqual(new rubik.Phase1Cube(checkCube), goodCube,
      "Cubes do not match after " + (i+1) + " moves.");
  }
}

function testPhase1CubeMove() {
  var moves = new rubik.Phase1Moves();
  var cube = new rubik.Phase1Cube();

  var scramble = rubik.parseMoves("L R2 B2 F2 L2 U' B2 F U R2 F' L2 R' B' F2 " +
    "D2 R U' L' R U2 F2 D U' R2 U B2 F D U");
  for (var i = 0, len = scramble.length; i < len; ++i) {
    cube.move(scramble[i], moves);
  }

  assert.equal(cube.yCO, 881);
  assert.equal(cube.yEO, 358);
  assert.equal(cube.eSlice, 337);
  assert.equal(cube.xCO, 1893);
  assert.equal(cube.mSlice, 476);
  assert.equal(cube.zCO, 43);
  assert.equal(cube.sSlice, 428);
  assert.equal(cube.zEO, 740);
  assert.equal(cube.xEO, 1676);
}

function testPhase1XEO() {
  var moves = new rubik.Phase1Moves();
  var scrambles = [
    "L R2 B2 F2 L2 U' B2 F U R2 F' L2 R' B' F2 D2 R U' L' R U2 F2 D U' " +
      "R2 U B2 F D U",
    "B F' D U' L D B2 F2 L R2 B2 L2 F' D B' F2 R' B2 F L2 R' D2 U' L' B' " +
      "R2 B U B L2",
    "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
  ];
  var expectedValues = [0x68c, 0xb7, 0x7ff];

  for (var i = 0, len = scrambles.length; i < len; ++i) {
    var expected = expectedValues[i];
    var cube = new rubik.Phase1Cube();
    var scramble = rubik.parseMoves(scrambles[i]);
    for (var j = 0; j < scramble.length; ++j) {
      cube.move(scramble[j], moves);
    }
    assert.equal(cube.xEO, expected);
  }
}

testPhase1Conversion();
testPhase1CubeMove();
testPhase1XEO();
console.log('PASS');
