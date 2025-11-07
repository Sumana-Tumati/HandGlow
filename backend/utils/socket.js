let io;

exports.initSocket = (server, opts = {}) => {
  const { Server } = require('socket.io');
  io = new Server(server, opts);

  io.on('connection', (socket) => {
    // client should send "join" with their user id so server can put socket in a room named by user id
    socket.on('join', (userId) => {
      socket.join(String(userId));
    });

    socket.on('disconnect', () => {
      // handle disconnect if needed
    });
  });

  return io;
};

exports.getIO = () => io;
