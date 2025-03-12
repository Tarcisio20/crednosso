import { typeOperationType } from "@/types/typeOperationType";

export const returnNameTypeOperation = (array : typeOperationType[], id : number) => {
    const item = array.find(item  => item.id_system === id)
    return item ? item.name : 'Nao Localizado'
}