import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import app from './app';

const PORT = process.env.PORT || 3000;
const dbURI = process.env.DB_URI;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

async function main() {
  try {
    mongoose.set('strictQuery', false);
    if (!dbURI) {
      return console.log(
        'Error connecting to database. Missing Database Connection String'
      );
    }
    await mongoose.connect(dbURI, { dbName: 'PokerPlanning' });
    console.log('Connected to Database');
    server.listen(PORT, () => {
      console.log('App live on port', PORT);
    });
  } catch (error) {
    console.log('Error on connection to database');
  }
}

main();

import createRoom from '@Room/createRoom';
import joinRoom from '@Room/joinRoom';
import changeUsername from '@Room/changeUsername';
import clientDisconnect from '@Room/clientDisconnect';
import revealCards from '@Cards/revealCards';
import selectCard from '@Cards/selectCard';
import startNewVoting from '@Cards/startNewVoting';
import newIssue from '@Issues/newIssue';
import deleteAllIssues from '@Issues/deleteAllIssues';
import deleteIssue from '@Issues/deleteIssue';
import editIssue from '@Issues/editIssue';

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
};

io.on('connection', onConnection);
