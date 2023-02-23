import { Server, Socket } from 'socket.io';
import { Issue } from 'models/Issue';
import Room from 'models/Room';

export default (io: Server, client: Socket & { sessionId?: string }) => {
    client.on(
        'client:edit_issue',
        async ({ issue, roomId }: { issue: Issue; roomId: string }) => {
            console.log('Client edited issue', roomId, client.sessionId);

            await Room.updateOne(
                {
                    _id: roomId
                },
                {
                    $set: {
                        'issues.$[e1].title': issue.title ?? "",
                        'issues.$[e1].description': issue.description ?? "",
                        'issues.$[e1].link': issue.link ?? "",
                        'issues.$[e1].storyPoints': issue.storyPoints ?? "-",
                        'issues.$[e1].voting': issue.voting ?? false,
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

            client.broadcast.to(roomId).emit('server:issues', room.issues)
        }
    );
};
