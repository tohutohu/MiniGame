function Position(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype = {
  add: function(x, y) {
    this.x += x;
    this.y += y;
  }
};
