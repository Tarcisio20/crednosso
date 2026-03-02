export type atmForOrderToSupply = {
    id_treasury: number;
    id_system: number;
    name: string;
    cassete_a: number;
    cassete_b: number;
    cassete_c: number;
    cassete_d: number;
}

export type orderToSupplyType = {
    change: boolean;
    cassete_a: number;
    cassete_b: number;
    cassete_c: number;
    cassete_d: number;
    date_order: string;
    id_order: number;
    obs: string;
    status_order: number;
    treasury: number;
    type_operation: number;
    type_order: number;
    atm : atmForOrderToSupply[]
    for_payment: boolean;
    for_release: boolean;
    treasury_name   : string;
}