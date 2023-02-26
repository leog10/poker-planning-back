import { Server, Socket } from 'socket.io';
import { Issue } from 'models/Issue';
import Room from 'models/Room';

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on(
    'client:edit_issues_voting',
    async ({ issue, roomId }: { issue: Issue; roomId: string }) => {
      console.log('Client edited voting now issues', roomId, client.sessionId);

      await Room.updateOne(
        {
          _id: roomId
        },
        {
          $set: {
            'issues.$[].voting': false
          }
        }
      );

      await Room.updateOne(
        {
          _id: roomId
        },
        {
          $set: {
            'issues.$[e1].voting': true
          }
        },
        {
          arrayFilters: [{ 'e1.id': issue.id }]
        }
      );

      const room = await Room.findById(roomId);

      if (!room) {
        return;
      }

      client.broadcast.to(roomId).emit('server:issues', room.issues);
    }
  );
};
