export type supplyForDayType = {
    id ?: number;
    id_atm : number;
    id_treasury : number;
    cassete_A : number;
    cassete_B : number;
    cassete_C : number;
    cassete_D : number;
    total_exchange : boolean;
    status : boolean;

    createdAt ?: string;
    updatedAt ?: string;
    date ?: string;
    date_on_supply ?: string;
    id_order ?: number;
}