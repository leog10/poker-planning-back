import { Server, Socket } from 'socket.io';
import Room from 'models/Room';

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on('client:delete_all_issues', async roomId => {
    console.log('Client delete all issues', roomId, client.sessionId);

    const room = await Room.findById(roomId);

    if (!room) {
      return;
    }

    room.issues = [];

    room.save();

    client.broadcast.to(roomId).emit('server:issues', room.issues);
  });
};
