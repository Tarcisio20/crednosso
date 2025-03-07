import { treasuryType } from "@/types/treasuryType";

export const returnNameTreasury = (array : treasuryType[], id : number) => {
    console.log("array", array)
    console.log("id", id)
    const item = array.find(item  => item.id === id)
    return item ? item.name : 'Nao Localizado'
}