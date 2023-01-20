import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';
import app from './app';
import changeUsername from './sockets/Room/changeUsername';

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

import createRoom from './sockets/Room/createRoom';
import joinRoom from './sockets/Room/joinRoom';
import revealCards from './sockets/Cards/revealCards';
import selectCard from './sockets/Cards/selectCard';
import startNewVoting from './sockets/Cards/startNewVoting';
import clientDisconnect from './sockets/Room/clientDisconnect';
import newIssue from './sockets/Issues/newIssue';

const onConnection = (socket: Socket) => {
  createRoom(io, socket);
  joinRoom(io, socket);
  changeUsername(io, socket);
  selectCard(io, socket);
  revealCards(io, socket);
  startNewVoting(io, socket);
  clientDisconnect(socket);
  newIssue(io, socket);
};

io.on('connection', onConnection);
