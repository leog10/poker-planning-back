import { Server, Socket } from "socket.io";
import { Issue } from "models/Issue";
import Room from "models/Room";

export default (io: Server, client: Socket & { sessionId?: string }) => {
  client.on(
    "client:new_issue",
    async ({ issue, roomId }: { issue: Issue; roomId: string }) => {
      console.log("Client create issue", roomId, client.sessionId);

      const room = await Room.findById(roomId);

      if (!room) {
        return;
      }

      const newIssue: Issue = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        link: issue.link,
        storyPoints: issue.storyPoints,
        voting: issue.voting,
      };

      room.issues.push(newIssue);

      room.save();

      client.broadcast.to(roomId).emit("server:issues", room.issues);
    }
  );
};
