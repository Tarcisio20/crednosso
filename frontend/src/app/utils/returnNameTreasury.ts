import { treasuryType } from "@/types/treasuryType";

export const returnNameTreasury = (array : treasuryType[], id : number) => {
    const item = array.find(item  => item.id === id)
    return item ? item.name : 'Nao Localizado'
}