export type treasuryType = {
    id ?: number;
    id_system :  number;
    id_type_supply : number;
    id_type_store : number;
    name : string;
    short_name : string;
    account_number : string;
    gmcore_number : string;
    bills_10 ?: number;
    bills_20 ?: number;
    bills_50 ?: number;
    bills_100 ?: number;
    account_number_for_transfer ?: string;
    status ?: boolean;
}