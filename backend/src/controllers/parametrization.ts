import { RequestHandler } from "express";
import { createLog } from "services/logService";
import { addEmailCtrl, getEmailsCtrl, getEmailsCtrlBySlugTypeStore } from "services/parametrization";


export const getAllEmailControl: RequestHandler = async (req, res) => {
     try {
        const parametrizationEmail = await getEmailsCtrl()
        if (!parametrizationEmail) {
            await createLog({
                level: 'ERROR',
                action: 'GET_PARAMETRIZATION_EMAIL',
                message: 'Erro ao buscar!',
                userSlug: req.userSlug ?? null,
                route: req.route?.path ?? null,
                method: req.method ?? null,
                statusCode: 400,
                resource: 'emailParametrization',
                meta: {  }
            })
            res.status(400).json({ error: 'Erro ao salvar!' })
            return
        }
        await createLog({
            level: 'INFO',
            action: 'GET_PARAMETRIZATION_EMAIL',
            message: 'Sucesso ao buscar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 201,
            resource: 'emailParametrization',
            meta: { }
        })
        res.status(201).json({ parametrizationEmail })
        return
    } catch (error) {
        await createLog({
            level: 'ERROR',
            action: 'GET_PARAMETRIZATION_EMAIL',
            message: 'Erro ao salvar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 400,
            resource: 'emailParametrization',
            meta: { }
        })
        res.status(400).json({ error: 'Erro ao salvar!' })
        return
    }
}

export const getAllEmailControlForSlugTypeStore: RequestHandler = async (req, res) => {
    const { slug } = req.params
    if(!slug){
        await createLog({
            level: 'ERROR',
            action: 'GET_PARAMETRIZATION_EMAIL_BY_SLUG_TYPE_STORE',
            message: 'Preciso de um dos dados para adicioanr!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 400,
            resource: 'emailParametrization',
             meta: { slug }
        })
        res.status(400).json({ error: 'Preciso de um Slug para continuar!' })
        return
    }

    try{
        const parametrizationEmail = await getEmailsCtrlBySlugTypeStore(slug)
        if(!parametrizationEmail){
            await createLog({
                level: 'ERROR',
                action: 'GET_PARAMETRIZATION_EMAIL_BY_SLUG_TYPE_STORE',
                message: 'Erro ao buscar!',
                userSlug: req.userSlug ?? null,
                route: req.route?.path ?? null,
                method: req.method ?? null,
                statusCode: 400,
                resource: 'emailParametrization',
                meta: { slug }
            })
            res.status(400).json({ error: 'Erro ao buscar!' })
            return
        }
        res.status(200).json({ parametrizationEmail })
        return
    }catch(error){
        await createLog({
            level: 'ERROR',
            action: 'GET_PARAMETRIZATION_EMAIL_BY_SLUG_TYPE_STORE',
            message: 'Erro ao buscar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 400,
            resource: 'emailParametrization',
            meta: { slug }
        })
        res.status(400).json({ error: 'Erro ao buscar!' })
        return
    }
}

export const addEmailControl: RequestHandler = async (req, res) => {
    const safeData = req.body
    
    if (safeData.length === 0) {
        await createLog({
            level: 'ERROR',
            action: 'ADD_PARAMETRIZATION_EMAIL',
            message: 'Preciso de um dos dados para adicioanr!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 400,
            resource: 'emailParametrization',
        })
        res.status(400).json({ error: 'Preciso de um ID para continuar!' })
        return
    }
    try {
        const parametrizationEmail = await addEmailCtrl(safeData)
        if (!parametrizationEmail) {
            await createLog({
                level: 'ERROR',
                action: 'ADD_PARAMETRIZATION_EMAIL',
                message: 'Erro ao salvar!',
                userSlug: req.userSlug ?? null,
                route: req.route?.path ?? null,
                method: req.method ?? null,
                statusCode: 400,
                resource: 'emailParametrization',
                meta: { ids: safeData }
            })
            res.status(400).json({ error: 'Erro ao salvar!' })
            return
        }
        await createLog({
            level: 'INFO',
            action: 'ADD_PARAMETRIZATION_EMAIL',
            message: 'Sucesso ao salvar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 201,
            resource: 'emailParametrization',
            meta: { ids: safeData }
        })
        res.status(201).json({ parametrizationEmail })
        return
    } catch (error) {
        await createLog({
            level: 'ERROR',
            action: 'ADD_PARAMETRIZATION_EMAIL',
            message: 'Erro ao salvar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 400,
            resource: 'emailParametrization',
            meta: { ids: safeData, error: String(error) }
        })
        res.status(400).json({ error: 'Erro ao salvar!' })
        return
    }
}