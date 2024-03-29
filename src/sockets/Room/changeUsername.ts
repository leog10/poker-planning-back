import { Server, Socket } from "socket.io";
import Room from "models/Room";

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on("client:change_username", async ({ username, roomId }) => {
    await Room.updateOne(
      {
        _id: roomId,
      },
      {
        $set: {
          "users.$[e1].username": username,
          "voting.$[e1].username": username,
        },
      },
      {
        arrayFilters: [{ "e1.clientId": client.sessionId }],
      }
    );

    const room = await Room.findById(roomId).exec();

    if (room) {
      io.to(roomId).emit("server:users", {
        roomVoting: room.voting,
        reveal: room.reveal,
      });
      client.emit("server:client_id", client.sessionId);
    }
  });
};
