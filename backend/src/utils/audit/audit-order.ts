// src/utils/audit/audit-order.ts
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
 * Extrai IDs de payloads com "connect" do Prisma, mas também aceita formato plano.
 * Ex.: typeOperation.connect.id  -> id_type_operation
 *      treasuryOrigin.connect.id_system -> id_treasury_origin
 */
function getIdTypeOperation(data: AnyObj) {
  return (
    data?.id_type_operation ??
    data?.typeOperation?.connect?.id ??
    null
  );
}
function getIdTreasuryOrigin(data: AnyObj) {
  return (
    data?.id_treasury_origin ??
    data?.treasuryOrigin?.connect?.id_system ??
    null
  );
}
function getIdTreasuryDestin(data: AnyObj) {
  return (
    data?.id_treasury_destin ??
    data?.treasuryDestin?.connect?.id_system ??
    null
  );
}
function getIdTypeOrder(data: AnyObj) {
  return (
    data?.id_type_order ??
    data?.typeOrder?.connect?.id ??
    null
  );
}
function getIdStatusOrder(data: AnyObj) {
  return (
    data?.status_order ??
    data?.statusOrder?.connect?.id ??
    null
  );
}

/**
 * Sanitiza UM order (ajuste conforme seu schema real do Prisma).
 * Mantemos só campos seguros/úteis para auditoria.
 */
export function sanitizeOrder(data: AnyObj | null | undefined) {
  if (!data) return null;

  const {
    id,
    // IDs (podem vir planos ou via relações expandidas)
    id_type_operation,
    id_treasury_origin,
    id_treasury_destin,
    id_type_order,
    status_order,

    // relações (se vierem expandidas)
    typeOperation,
    treasuryOrigin,
    treasuryDestin,
    typeOrder,
    statusOrder,

    // valores e atributos principais
    date_order,
    requested_value_A,
    requested_value_B,
    requested_value_C,
    requested_value_D,
    confirmed_value_A,
    confirmed_value_B,
    confirmed_value_C,
    confirmed_value_D,
    observation,
    composition_change,

    // timestamps (se existirem no seu modelo)
    createdAt,
    updatedAt,

    // ...rest ignorado
  } = data as AnyObj;

  return {
    id,
    // normalizamos os IDs, preferindo o plano e caindo para a relação se existir
    id_type_operation:
      typeof id_type_operation === 'number'
        ? id_type_operation
        : (typeOperation?.id ?? null),
    id_treasury_origin:
      typeof id_treasury_origin === 'number'
        ? id_treasury_origin
        : (treasuryOrigin?.id_system ?? treasuryOrigin?.id ?? null),
    id_treasury_destin:
      typeof id_treasury_destin === 'number'
        ? id_treasury_destin
        : (treasuryDestin?.id_system ?? treasuryDestin?.id ?? null),
    id_type_order:
      typeof id_type_order === 'number'
        ? id_type_order
        : (typeOrder?.id ?? null),
    status_order:
      typeof status_order === 'number'
        ? status_order
        : (statusOrder?.id ?? null),

    date_order,
    requested_value_A,
    requested_value_B,
    requested_value_C,
    requested_value_D,
    confirmed_value_A,
    confirmed_value_B,
    confirmed_value_C,
    confirmed_value_D,
    observation,
    composition_change,

    createdAt,
    updatedAt,
  };
}

/**
 * Sanitiza payload de criação/edição (aceita tanto formato plano quanto com connect).
 * Convertemos tudo para um shape plano com id_* para facilitar leitura do log.
 */
export function sanitizeOrderPayload(data: AnyObj | null | undefined) {
  if (!data) return null;

  return {
    id_type_operation: getIdTypeOperation(data),
    id_treasury_origin: getIdTreasuryOrigin(data),
    id_treasury_destin: getIdTreasuryDestin(data),
    id_type_order:     getIdTypeOrder(data),
    status_order:      getIdStatusOrder(data),

    date_order: data?.date_order ?? null,

    requested_value_A: data?.requested_value_A ?? null,
    requested_value_B: data?.requested_value_B ?? null,
    requested_value_C: data?.requested_value_C ?? null,
    requested_value_D: data?.requested_value_D ?? null,

    confirmed_value_A: data?.confirmed_value_A ?? null,
    confirmed_value_B: data?.confirmed_value_B ?? null,
    confirmed_value_C: data?.confirmed_value_C ?? null,
    confirmed_value_D: data?.confirmed_value_D ?? null,

    observation: data?.observation ?? null,
    composition_change: data?.composition_change ?? null,
  };
}

/** Sanitiza uma lista de orders */
export function sanitizeOrderList(list: AnyObj[] | null | undefined) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => sanitizeOrder(item));
}
