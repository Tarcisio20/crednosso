import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../types/express';

export function requestLogger(req: ExtendedRequest, res: Response, next: NextFunction) {
  const slug = req.userSlug ?? 'anonymous';
  // Exemplo simples de log. Troque por pino/winston se quiser estruturação
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} slug=${slug}`);
  next();
}