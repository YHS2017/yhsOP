const express = require('express');
const http = require('http');
const io = require('socket.io');
const Game = require('./game');

const app = express();

const server = http.createServer(app);

const socket = io(server, {
  cors: {
    origin: '*'
  }
});

const game = new Game();

socket.on('connection', (client) => {
  console.log('Client connected');
  const player = game.addPlayer(client.id);
  client.join(player.roomId);
  socket.to(client.id).emit('added', player);
  const room = game.getRoom(player.roomId);
  socket.to(player.roomId).emit('joined', room.players);

  client.on('disconnect', () => {
    console.log('Client disconnected');
    const player = game.getPlayer(client.id);
    game.removePlayer(player);
    socket.to(room.id).emit('leaved', player);
  });

  client.on('message', (message) => {
    console.log('Message received: ', message);
    socket.emit('message', message);
  });
});

server.listen(5000, () => {
  console.log('Server started on port 5000');
});