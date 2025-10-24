// src/services/logService.ts
import { prisma } from '../utils/prisma'; // ajuste seu path
import type { Request } from 'express';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

type CreateLogInput = {
  level: LogLevel;
  action: string;                 // EX: 'TREASURY_ADD'
  message?: string;               // EX: 'Tesouraria criada com sucesso'
  userSlug?: string | null;       // preenchido por verifyJWT
  route?: string;                 // req.originalUrl
  method?: string;                // req.method
  statusCode?: number;            // res.statusCode
  resource?: string;              // EX: 'treasury'
  resourceId?: string | null;     // EX: '123'
  meta?: Record<string, any> | null; // payloads reduzidos/sanitizados
};

export async function createLog(input: CreateLogInput) {
  try {
    // nunca permita que o log derrube a requestmeu logService é esse 

    
    await prisma.log.create({
      data: {
        level: input.level,
        action: input.action,
        message: input.message ?? '',
        userSlug: input.userSlug ?? null,
        route: input.route ?? null,
        method: input.method ?? null,
        statusCode: input.statusCode ?? null,
        resource: input.resource ?? null,
        resourceId: input.resourceId ?? null,
        meta: input.meta as any, // JSON
      },
    });
  } catch (err) {
    // loga só no console e segue a vida
    console.warn('[logService] Falha ao gravar log:', err);
  }
}
