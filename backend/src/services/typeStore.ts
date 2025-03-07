import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllTypeStores = async () => {
    const typeSupply = await prisma.typeStore.findMany()
    if(typeSupply){
        return typeSupply
    }
    return null
}

export const getTypeStoreForId = async (id : string) => {
    const typeStore = await prisma.typeStore.findFirst({
        where : { id : parseInt(id) }
    })
    if(typeStore ){
        return typeStore 
    }
    return null
}

export const addTypeStore = async (data : Prisma.typeStoreCreateInput) => {
    const typeSupply = await prisma.typeStore.create({ data })
    if(typeSupply){
        return typeSupply
    }
    return null
}


export const updateTypeStore = async (id: number, data : Prisma.typeStoreUpdateInput) => {
    const editStore = await prisma.typeStore.update({
        where : {
            id
        },
        data
    }) 
    if(editStore){
        return editStore
    }
    return null
}
