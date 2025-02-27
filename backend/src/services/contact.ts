import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"


export const getForIdTreasury = async (id : number ) => {
    const contact = await prisma.contact.findFirst({
        where : { id_treasury : id  }
    })
    if(contact){
        return contact
    }
    return null
}


export const addContact = async (data : Prisma.ContactCreateInput) => {
    const contact = await prisma.contact.create({ data })
    if(contact){
        return contact
    }
    return null
}