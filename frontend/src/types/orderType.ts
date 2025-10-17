export type orderType = {
    id ?: number;
    id_type_operation : number;
    id_treasury_origin : number;
    id_treasury_destin : number;
    date_order : string,
    id_type_order : number;
    requested_value_A : number;
    requested_value_B : number;
    requested_value_C : number;
    requested_value_D : number;
    composition_change ?: boolean;
    confirmed_value_A ?: number;
    confirmed_value_B ?: number;
    confirmed_value_C ?: number;
    confirmed_value_D ?: number;
    for_payment ?: boolean;
    for_release ?: boolean;
    status_order : number;
    observation : string;
}