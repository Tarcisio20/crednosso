export type supplyType = {
    id ?: number;
    id_atm : number;
    atm ?: { id: number; name: string };
    cassete_A : number;
    cassete_B : number;
    cassete_C : number;
    cassete_D : number;
    total_exchange : boolean;
    status ?: boolean;
    id_treasury : number;
    id_order : number;
    date_on_suply ?: string;
} 