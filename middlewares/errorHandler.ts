import { Request, Response } from 'express';

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
};
