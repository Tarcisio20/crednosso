// src/utils/audit/audit-socket.ts
type AnyObj = Record<string, any>;

/** Diff genérico: quais campos mudaram { from, to } */
export function diffObjects(before: AnyObj = {}, after: AnyObj = {}) {
  const changed: Record<string, { from: any; to: any }> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    const a = before[k];
    const b = after[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changed[k] = { from: a, to: b };
    }
  }
  return changed;
}

/**
 * Sanitiza UM evento de socket "emitido" (resultado/estado logável).
 * Mantenha apenas campos seguros (sem dados sensíveis).
 * Use quando você quiser registrar o que FOI emitido.
 */
export function sanitizeSocketEvent(data: AnyObj | null | undefined) {
  if (!data) return null;

  // Aceitamos uma forma "livre". Exemplos úteis:
  // { event: "tarefa_iniciada", payload: { mensagem: "..." }, room: "...", namespace: "...", status: "OK" }
  const {
    event,           // nome do evento emitido (ex.: "tarefa_iniciada")
    payload,         // conteúdo emitido
    room,            // sala (se usar io.to(room).emit)
    namespace,       // namespace (se usar io.of("/ns").emit)
    status,          // "OK" | "ERROR" (se quiser marcar status final)
    createdAt,
    updatedAt,
  } = data;

  // Do payload, coletamos apenas chaves "não sensíveis" — mantenha a mensagem e chaves simples.
  const safePayload = payload && typeof payload === 'object'
    ? {
        mensagem: payload.mensagem,
      }
    : undefined;

  return {
    event,
    payload: safePayload,
    room,
    namespace,
    status,
    createdAt,
    updatedAt,
  };
}

/**
 * Sanitiza payload de EMISSÃO (entrada) antes de logar a tentativa de envio.
 * Útil para `meta.payload` nos logs.
 */
export function sanitizeSocketPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  // Permitimos apenas campos de baixo risco:
  const {
    event,               // nome do evento que pretendemos emitir
    mensagem,            // conteúdo textual
    room,                // opcional
    namespace,           // opcional
  } = data;

  return {
    event,
    mensagem,
    room,
    namespace,
  };
}
