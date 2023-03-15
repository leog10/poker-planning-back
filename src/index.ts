import { createServer } from "http";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import app from "./app";

const PORT = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
  },
});

// Utility function to suspend execution of current process
async function sleep(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Set variables to be used by all calls to `mightFail`
// Tip: You could also store `MAX_RETRIES` and `THROTTLE_TIME_MS`
// in App Services Values
const MAX_RETRIES = 5;
const THROTTLE_TIME_MS = 3000;
let currentRetries = 1;

async function main() {
  console.log("Connecting... Attempt:", currentRetries);

  try {
    mongoose.set("strictQuery", false);
    if (!dbURI) {
      return console.log(
        "Error connecting to database. Missing Database Connection String"
      );
    }
    await mongoose.connect(dbURI, { dbName: "PokerPlanning" });
    console.log("Connected to Database");
    server.listen(PORT, () => {
      console.log("App live on port", PORT);
    });
  } catch (error) {
    if (currentRetries === MAX_RETRIES) {
      console.error(
        `Reached maximum number of retries (${MAX_RETRIES}) without successful execution.`
      );
      return;
    }

    console.log("Error on connection to database");
    console.error(error);
    currentRetries++;
    await sleep(THROTTLE_TIME_MS);
    await main();
  }
}

main();

import createRoom from "@Room/createRoom";
import joinRoom from "@Room/joinRoom";
import changeUsername from "@Room/changeUsername";
import clientDisconnect from "@Room/clientDisconnect";
import revealCards from "@Cards/revealCards";
import selectCard from "@Cards/selectCard";
import startNewVoting from "@Cards/startNewVoting";
import newIssue from "@Issues/newIssue";
import deleteAllIssues from "@Issues/deleteAllIssues";
import deleteIssue from "@Issues/deleteIssue";
import editIssue from "@Issues/editIssue";
import editVotingNow from "@Issues/editVotingNow";

const onConnection = (socket: Socket) => {
  createRoom(io, socket);
  joinRoom(io, socket);
  changeUsername(io, socket);
  selectCard(io, socket);
  revealCards(io, socket);
  startNewVoting(io, socket);
  clientDisconnect(socket);
  newIssue(io, socket);
  deleteAllIssues(io, socket);
  deleteIssue(io, socket);
  editIssue(io, socket);
  editVotingNow(io, socket);
};

io.on("connection", onConnection);
