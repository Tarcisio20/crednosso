import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllContact = async () => {
    const contact = await prisma.contact.findMany()
    if(contact){
        return contact
    }
    return null
}

export const getForIdTreasury = async (id : number ) => {
    const contact = await prisma.contact.findMany({
        where : { id_treasury : id, status : true  }
    })
    if(contact){
        return contact
    }
    return null
}

export const getContactForId = async (id : string) => {
    const contact = await prisma.contact.findFirst({
        where : { id : parseInt(id) }
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

export const updateContact = async (id: number, data : Prisma.ContactUpdateInput) => {
    const contact = await prisma.contact.update({
        where : {
            id
        },
        data
    }) 
    if(contact){
        return contact
    }
    return null
}

export const delContact = async (id: number) => {
    const contact = await prisma.contact.update({
        where : {
            id
        },
        data : {
            status : false
        }
    }) 
    if(contact){
        return contact
    }
    return null
}