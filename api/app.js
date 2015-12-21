var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT);
var io = require('socket.io').listen(server);

var channels = {};

io.on('connection', function(socket) {
  
  socket.emit('allChannels', channels);
  
  socket.on('message', function(data) {
    channels[data.channel].push(data.message);
    io.to(data.channel).emit('message', data);
  });
  
  socket.on('createChannel', function(channel) {
    channels[channel] = [];
    socket.join(channel);
    socket.emit("newChannel", channel);
  });

  socket.on('joinChannel', function(channel) {
    socket.join(channel);
  });
});

console.log("Express is listening to port " + PORT);