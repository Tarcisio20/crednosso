import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const addContact = async (data : Prisma.ContactCreateInput) => {
    const contact = await prisma.contact.create({ data })
    if(contact){
        return contact
    }
    return null
}