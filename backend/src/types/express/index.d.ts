// src/types/express/index.d.ts

import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adiciona a propriedade `user` à interface Request
    }
  }
}
