import { Request, Response } from 'express';

export const getRoom = (req: Request, res: Response) => {
  const roomId = req.params.roomId;
  res.json({ roomId, msg: 'room id working' });
};
