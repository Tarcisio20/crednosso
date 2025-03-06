import { statusOrderType } from "@/types/statusOrder"

export const returnNameStatus = (array : statusOrderType[], id : number) => {
    const item = array.find(item  => item.id === id)
    return item ? item.name : 'Nao Localizado'
}