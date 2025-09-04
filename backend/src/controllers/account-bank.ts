import { RequestHandler } from "express"
import { addAccountBank, delAccountBank, getAllAccountPagination, getForId, updateAccountBank } from "../services/account-bank";
import { AccontBankAddSchema } from "../schemas/addAccountBank";
import { hash } from "crypto";
export const getAllPagination: RequestHandler = async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 15;
    const skip = (page - 1) * pageSize;

    const account = await getAllAccountPagination(page, pageSize)
    if (!account) {
        res.status(401).json({ error: 'Erro ao carregar!' })
        return
    }
    res.json({ account })

}

export const add: RequestHandler = async (req, res) => {
    const safeData = AccontBankAddSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const newAccountBank = await addAccountBank({
        name: safeData.data.name,
        bank_branch: safeData.data.bank_branch,
        bank_branch_digit: safeData.data.bank_branch_digit,
        account: safeData.data.account,
        account_digit: safeData.data.account_digit,
        hash: safeData.data.hash,
        type: safeData.data.type,

    })
    if (!newAccountBank) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ account : newAccountBank })
}

export const getById: RequestHandler = async (req, res) => {
    const accountId = req.params.id
    if(!accountId || isNaN(parseInt(accountId))) {
        res.status(400).json({ error: 'ID inválido!' })
        return
    }
    const account = await getForId(parseInt(accountId))
    if (!account) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ account })
}

export const update: RequestHandler = async (req, res) => {
    const accountId = req.params.id
    const safeData = AccontBankAddSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const accountA = await updateAccountBank(parseInt(accountId), safeData.data)
    if (!accountA) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ account: accountA })

}

export const del: RequestHandler = async (req, res) => {
    const accountId = req.params.id

    if(!accountId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const accountA = await delAccountBank(parseInt(accountId))
    if(!accountA){  
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }
    

    res.json({ account: accountA })

}