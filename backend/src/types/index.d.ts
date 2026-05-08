// src/types/express/index.d.ts
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    idUser?: number;
    nivelUser?: string; 
    userSlug?: string;
  }
}
