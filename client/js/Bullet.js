function Bullet(param) {
  this.power = 10; //param.power;
  this.pos = new Position(param.x, param.y);
  this.velocity = param.v;
  this.direction = param.dir;
  console.log(this.pos);
}

Bullet.prototype = {
  draw: function(cvx) {
    cvx.fillStyle = 'rgba(150,30,30,1)';
    cvx.fillRect(this.pos.x - 5, this.pos.y - 5, 10, 10);
  },
  drawEnemy: function(cvx) {
    cvx.fillStyle = 'rgba(150,30,30,1)';
    cvx.fillRect(CANVAS_WIDTH - (this.pos.x - 5), this.pos.y - 5, 10, 10);
  },
  update: function() {
    var radians = this.direction * Math.PI / 180;
    this.pos.add(this.velocity * Math.cos(radians), this.velocity * Math.sin(radians));
  }
};
