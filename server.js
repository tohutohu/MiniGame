var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var battle_id = 0;

server.listen(3000);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

var lobbyPlayer = {};

//ロビー処理
io.on('connection', function(socket) {
  socket.on('registerPlayer', function(data) {
    lobbyPlayer[socket.id] = {
      id: socket.id,
      name: data.name
    };
    console.log(lobbyPlayer);
    io.emit('updatePlayer', lobbyPlayer);
  });
  socket.on('disconnect', function() {
    if (lobbyPlayer[socket.id]) {
      io.emit('updatePlayer', lobbyPlayer);
      delete lobbyPlayer[socket.id];
    }
  });
  // io.emit('battle_proposal', function(data) {
  //   battle_id = (battle_id + 1) % 1000;
  //   io.to(data.enemyId).emit('battle_start', {
  //     battle_id: battle_id
  //   });
  //   battleStart(battle_id);
  // });

});

function battleStart(battle_id) {
  io.of("/battle/" + battle_id).on('connection', function(socket) {
    socket.broadcast.emit('connect_player', {
      message: "バトルID:" + battle_id + " 相手のID:" + socket.id
    });
    socket.on('pos', function(data) {
      socket.broadcast.emit('position', {
        x: data.posx,
        dir: data.dir
      });
    });
    socket.on('shot', function(data) {
      console.log(data);
      socket.broadcast.emit('enemyBulletsUpdate', data);
    });
  });
}
