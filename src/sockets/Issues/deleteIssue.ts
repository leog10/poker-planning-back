import { Server, Socket } from "socket.io";
import Room from "models/Room";

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on(
    "client:delete_issue",
    async ({ issueId, roomId }: { issueId: string; roomId: string }) => {
      console.log("Client delete issue", roomId, issueId, client.sessionId);

      await Room.updateOne(
        {
          _id: roomId,
        },
        { $pull: { issues: { id: issueId } } }
      );

      const room = await Room.findById(roomId);

      if (!room) {
        return;
      }

      client.broadcast.to(roomId).emit("server:issues", room.issues);
    }
  );
};
