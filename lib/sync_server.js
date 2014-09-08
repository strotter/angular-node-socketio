var socketio = require('socket.io');
var io;
var guestNumber = 1;
var clients = {};

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function (socket) {
    console.log('got connection --' + socket.id);
    socket.emit('clientIdChange', {clientId: socket.id});
    clientNum = assignClient(socket, guestNumber);
    handleMessageBroadcasting(socket);
    socket.on('update', function (test) {
      console.log('got update: ' + JSON.stringify(test));
    })
    handleClientDisconnection(socket);
  });
};

function assignClient(socket, guestNumber) {
  clients[socket.id] = 'test';
  socket.emit('newConnection', {
    success: true,
    name: socket.id
  });
  return guestNumber + 1;
}

function handleMessageBroadcasting(socket) {
  socket.on('update', function (message) {
    console.log('Emitting update: ', JSON.stringify(message));
    socket.broadcast.emit('update', {
      whoDunnit: socket.id,
      newData: message.newData
    });
  });
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    delete clients[socket.id];
  });
}
