export type AtmMonitoringType = {
  id: string;
  id_atm: string;
  name_atm: string;
  ativo_atm: string;
  saldo_logico: string;
  saldo_rejeicao: string;
  total_logico: string;
  saldo_conta: string;
  status : boolean;

  cassete_a: string;
  cassete_a_rejeicao: string;
  cassete_a_cedula: string;
  cassete_a_ativo: string;
  cassete_a_habilitado: string;

  cassete_b: string;
  cassete_b_rejeicao: string;
  cassete_b_cedula: string;
  cassete_b_ativo: string;
  cassete_b_habilitado: string;

  cassete_c: string;
  cassete_c_rejeicao: string;
  cassete_c_cedula: string;
  cassete_c_ativo: string;
  cassete_c_habilitado: string;

  cassete_d: string;
  cassete_d_rejeicao: string;
  cassete_d_cedula: string;
  cassete_d_ativo: string;
  cassete_d_habilitado: string;

  createdAt: string;
  updatedAt: string;
};