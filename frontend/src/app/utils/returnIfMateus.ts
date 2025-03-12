import { treasuryType } from "@/types/treasuryType"

export const returnIfMateus = (array : treasuryType[], id : number) => {
    return  array.some(item  => item?.id_system === id &&  item?.id_type_store === 1)
}