import Room from "models/Room";
import { Server } from "socket.io";

const FIBOCARDS = [
  { card: "0", checked: false },
  { card: "1", checked: false },
  { card: "2", checked: false },
  { card: "3", checked: false },
  { card: "5", checked: false },
  { card: "8", checked: false },
  { card: "13", checked: false },
  { card: "21", checked: false },
  { card: "34", checked: false },
  { card: "55", checked: false },
  { card: "89", checked: false },
  { card: "?", checked: false },
  { card: "☕", checked: false },
];

const updateIssue = async (
  averageVoting: number,
  roomId: string,
  io: Server
) => {
  const room = await Room.findById(roomId);

  if (!room) {
    return;
  }

  if (room.issues.some((issue) => issue.voting === true)) {
    const calculateStoryPoint = (averageVote: number) => {
      if (FIBOCARDS.some((card) => card.card === averageVote.toString())) {
        return averageVote.toString();
      }

      let storyPoint = 89;
      let check = 89;
      for (let i = FIBOCARDS.length - 1; i >= 0; i--) {
        if (isNaN(Number(FIBOCARDS[i].card))) continue;

        const checkNumber = averageVote - Number(FIBOCARDS[i].card);

        if (checkNumber >= 0 && checkNumber <= check) {
          storyPoint = Number(FIBOCARDS[i].card);
          check = checkNumber;
        }
      }

      return storyPoint.toString();
    };

    const storyPoints = calculateStoryPoint(averageVoting);

    const issueId = room.issues.find((issue) => issue.voting === true)?.id;

    await Room.updateOne(
      {
        _id: roomId,
      },
      {
        $set: {
          "issues.$[e1].storyPoints": storyPoints,
          "issues.$[e1].voting": false,
        },
      },
      {
        arrayFilters: [{ "e1.id": issueId }],
      }
    );

    const roomIssues = await Room.findById(roomId);

    if (!roomIssues) {
      return;
    }

    setTimeout(() => {
      io.to(roomId).emit("server:issues", roomIssues.issues);
    }, 1000);
  }
};

export default updateIssue;
