import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"

export const getAllContact = async () => {
  try {
    return await prisma.contact.findMany()
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [GET_ALL_CONTACT] *** ERROR =>", err)
    return null
  }
}

export const getForIdTreasury = async (id: number) => {
  try {
    return await prisma.contact.findMany({
      where: { id_treasury: id, status: true }
    })
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [GET_FOR_ID_TREASURY] *** ERROR =>", err)
    return null
  }
}

export const getContactForId = async (id: string) => {
  try {
    return await prisma.contact.findFirst({
      where: { id: parseInt(id) }
    })
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [GET_CONTACT_FOR_ID] *** ERROR =>", err)
    return null
  }
}

export const addContact = async (data: Prisma.ContactCreateInput) => {
  try {
    return await prisma.contact.create({ data })
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [ADD_CONTACT] *** ERROR =>", err)
    return null
  }
}

export const updateContact = async (id: number, data: Prisma.ContactUpdateInput) => {
  try {
    return await prisma.contact.update({
      where: {
        id
      },
      data
    })
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [UPDATE_CONTACT] *** ERROR =>", err)
    return null
  }
}

export const delContact = async (id: number) => {
  try {
    return await prisma.contact.update({
      where: {
        id
      },
      data: {
        status: false
      }
    })
  } catch (err) {
    console.log("SERVICE => [CONTACT] *** FUNCTION => [DEL_CONTACT] *** ERROR =>", err)
    return null
  }
}