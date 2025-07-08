export type OrderWithTreasuryProps = {
  id_order: number,
  id_type_operation: number,
  id_treasury_origin: number,
  id_treasury_destin: number,
  requested_value_A: number,
  requested_value_B: number,
  requested_value_C: number,
  requested_value_D: number,
  confirmed_value_A: number,
  confirmed_value_B: number,
  confirmed_value_C: number,
  confirmed_value_D: number,
  status_order: number;
  treasury_origin_name: string;
  treasury_destin_name: string;
}