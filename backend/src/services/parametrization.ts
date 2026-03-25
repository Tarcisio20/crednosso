import { Prisma } from "@prisma/client"
import { prisma } from "../utils/prisma"


export const getEmailsCtrl = async () => {
    try {
        return await prisma.emailParametrization.findMany()
    } catch (err) {
        console.log("SERVICE => [PARAMETRIZATION] *** FUNCTION => [GET_EMAILS] *** ERROR =>", err)
        return null
    }
}

export const getEmailsCtrlBySlugTypeStore = async (slugTypeStore: string) => {
    try {
        return await prisma.emailParametrization.findMany({
            where: {
                for_send_slug: slugTypeStore
            }
        })
    } catch (err) {
        console.log("SERVICE => [PARAMETRIZATION] *** FUNCTION => [GET_EMAILS_BY_SLUG_TYPE_STORE] *** ERROR =>", err)
        return null
    }
}
export const addEmailCtrl = async (data: Prisma.EmailParametrizationCreateInput) => {
    try {
        return await prisma.emailParametrization.create({ data })
    } catch (err) {
        console.log("SERVICE => [PARAMETRIZATION] *** FUNCTION => [ADD_PARAMETRIZATION_EMAIL] *** ERROR =>", err)
        return null
    }
}