var CANVAS_WIDTH = 1400,
  CANVAS_HEIGHT = 600;
var cv;
var cvx;

var x2 = null;
var direction2 = 1;
var lobbyPlayers = [];

var server = "http://localhost:3000";

var scale = 1;

var scene = null;

window.onresize = function() {
  var cv = document.querySelector("#disp");
  var rect = document.body.getBoundingClientRect();
  var scaleW = window.innerWidth / cv.width;
  var scaleH = window.innerHeight / cv.height;
  scale = scaleW < scaleH ? scaleW : scaleH;
  cv.style.transform = "scale(" + scale + ", " + scale + ")";
  cv.style.position = "fixed";
  cv.style.left = ((scale - 1) * cv.width / 2 + (window.innerWidth - cv.width * scale) / 2) + "px";
  cv.style.top = ((scale - 1) * cv.height / 2 + (window.innerHeight - cv.height * scale) / 2) + "px";
};

window.onload = function() {
  window.onresize();
  var x = 0,
    y = 0;
  var direction = 1;
  var speed = 0.8;
  var bullets = [];
  var enemyBullets = [];

  var socket = io.connect(server);

  socket.emit('registerPlayer', {
    name: window.prompt()
  });
  socket.on('updatePlayer', function(data) {
    lobbyPlayers = data;
  });

  socket.on('battleProposal', function(data) {

  });

  socket.on('position', function(data) {
    console.log(data);
    x2 = data.x;
    direction2 = data.dir;
  });
  socket.on('enemyBulletsUpdate', function(bulletInfo) {
    console.log(bulletInfo);
    var bullet = new Bullet({
      x: bulletInfo.pos.x,
      y: bulletInfo.pos.y,
      dir: bulletInfo.direction,
      v: bulletInfo.velocity
    });
    enemyBullets.push(bullet);
  });


  cv = document.getElementById("disp");
  cvx = cv.getContext("2d");

  init([KeyMap.right, KeyMap.Z]);

  //debug
  console.log("unko");
  cvx.fillStyle = 'rgba(0,0,0,0)';
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  var count = 0;
  scene = battle;
  (function run() {
    setTimeout(scene(count), 1000 / 60);
    count++;

  })();
};

function battle(count) {
  if (count % 60 === 0) {
    socket.emit('pos', {
      posx: x,
      dir: direction
    });
  }

  console.log(lobbyPlayers);


  cvx.fillStyle = 'rgba(30,200,50,1)';
  cvx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


  if (isPushed(KeyMap.right)) {
    direction = -1 * direction;
    socket.emit('pos', {
      posx: x,
      dir: direction
    });
  }
  if (isPushed(KeyMap.Z)) {
    var bullet = new Bullet({
      x: x,
      y: 440,
      v: 2,
      dir: 0
    });
    bullets.push(bullet);
    socket.emit('shot', bullet);
  }
  x += speed * direction;
  if (x < 0) x = 0;
  if (x + 40 > CANVAS_WIDTH / 2) x = CANVAS_WIDTH / 2 - 40;
  keyUpdate();
  bullets.forEach(function(bullet) {
    bullet.update();
    bullet.draw(cvx);
  });
  enemyBullets.forEach(function(bullet) {
    bullet.update();
    bullet.drawEnemy(cvx);
  });
  bullets = bullets.filter(function(bullet) {
    return !(bullet.pos.x < 0 || bullet.pos.x > CANVAS_WIDTH || bullet.pos.y < 0 || bullet.pos.y > CANVAS_HEIGHT);
  });
  enemyBullets = enemyBullets.filter(function(bullet) {
    return !(bullet.pos.x < 0 || bullet.pos.x > CANVAS_WIDTH || bullet.pos.y < 0 || bullet.pos.y > CANVAS_HEIGHT);
  });
  cvx.fillStyle = "rgba(100,100,0,1)";
  cvx.fillRect(0, 480, CANVAS_WIDTH, 120);
  cvx.fillStyle = "rgba(255,0,0,0.4)";
  cvx.fillRect(CANVAS_WIDTH / 2 - 2, 0, 4, CANVAS_HEIGHT);
  cvx.fillStyle = "rgba(0,0,0,1)";
  cvx.fillRect(x, 440, 40, 40);
  if (x2 !== null) {
    x2 += speed * direction2;
    if (x2 < 0) x2 = 0;
    if (x2 > CANVAS_WIDTH / 2 - 40) x2 = CANVAS_WIDTH / 2 - 40;
    cvx.fillRect(CANVAS_WIDTH - x2 - 40, 440, 40, 40);
  }
}
