import { Router } from 'express';
import authRouter from './auth';

const appRouter = Router();

appRouter.use('/api', authRouter);

export default appRouter;
