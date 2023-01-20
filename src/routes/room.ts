import { Router } from 'express';
import { getRoom } from '../controllers/roomController';

const roomRouter = Router();

roomRouter.get('/room/:id', getRoom);

export default roomRouter;
