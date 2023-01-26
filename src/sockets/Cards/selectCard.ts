import { Server, Socket } from 'socket.io';
import Room from 'models/Room';

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on('client:card_select', async ({ card, roomId, clientId }) => {
    console.log('Client select card', roomId, card, clientId, client.sessionId);

    await Room.updateOne(
      {
        _id: roomId
      },
      {
        $set: {
          'users.$[e1].card': card,
          'voting.$[e1].card': card
        }
      },
      {
        arrayFilters: [{ 'e1.clientId': client.sessionId }]
      }
    );

    const room = await Room.findById(roomId);

    if (!room) {
      console.log('room not found on card select');
      return;
    }

    io.to(roomId).emit('server:users', {
      roomVoting: room.voting,
      reveal: room.reveal
    });
  });
};
