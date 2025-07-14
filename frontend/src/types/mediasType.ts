export type MediaMensal = {
  mes: number
  media_solicitada: number
  media_confirmada: number
}

export type MediaAnual = {
  ano: number
  total_solicitado: number
  total_confirmado: number
  meses: MediaMensal[]
}
