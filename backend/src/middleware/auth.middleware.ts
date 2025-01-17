// 

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.util';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token : any = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
     res.status(401).json({ error: 'Unauthorized' });
  }
  try { 
    
    next();    
  } catch (err) { 
     res.status(401).json({ error: 'Invalid token' }); 
  }
};

