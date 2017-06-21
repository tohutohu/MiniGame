var KeyMap = {
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  0: 48,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  Enter: 13,
  Shift: 16,
  Ctrl: 17,
  Alt: 18,
  Space: 32,
};

beforeKeys = {};
keys = {};
init = function(initKeys) {
  for (var i = 0; i < initKeys.length; i++) {
    beforeKeys["" + initKeys[i]] = false;
    keys["" + initKeys[i]] = false;
  }
};
keyDown = function(e) {
  keys["" + e.keyCode] = true;
};
keyUp = function(e) {
  keys["" + e.keyCode] = false;
};
keyUpdate = function() {
  var keyNames = Object.keys(beforeKeys);
  for (var i = 0; i < keyNames.length; i++) {
    beforeKeys[keyNames[i]] = keys[keyNames[i]];
  }
};
isPushing = function(keyCode) {
  return keys["" + keyCode];
};
isPushed = function(keyCode) {
  return (keys["" + keyCode] && !beforeKeys["" + keyCode]);
};
