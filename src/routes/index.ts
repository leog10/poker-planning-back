import { Router } from 'express';
import authRouter from './auth';
import roomRouter from './room';

const appRouter = Router();

appRouter.use('/api', roomRouter, authRouter);

export default appRouter;
