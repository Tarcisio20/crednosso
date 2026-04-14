import { RequestHandler } from "express";
import { getAllBank } from "services/bank";
import { createLog } from "services/logService";
import { getOrdersByDay } from "services/order";
import { addEmailCtrl, getEmailsCtrl, getEmailsCtrlBySlugTypeStore } from "services/parametrization";
import { getForIds } from "services/treasury";
import { calcularEstornoBRL } from "utils/calcularEstorno";
import { bankType, GenerateArrays } from "utils/generateArrays";
import { gerarNomeArquivo } from "utils/gerarNomeArquivo";
import { gerarPdfBuffer } from "utils/gerarPdfBuffer";
import { returnValueTotal } from "utils/returnValueTotal";


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
                meta: {}
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
            meta: {}
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
            meta: {}
        })
        res.status(400).json({ error: 'Erro ao salvar!' })
        return
    }
}

export const getAllEmailControlForSlugTypeStore: RequestHandler = async (req, res) => {
    const { slug } = req.params
    if (!slug) {
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

    try {
        const parametrizationEmail = await getEmailsCtrlBySlugTypeStore(slug)
        if (!parametrizationEmail) {
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
    } catch (error) {
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

type MailAttachment = {
    filename: string
    content: Buffer
    contentType: string
}
export const sendEmailFinanceiro: RequestHandler = async (req, res) => {
    const safeData = req.body

    if (!safeData) {
        await createLog({
            level: 'ERROR',
            action: 'SEND_EMAIL_FINANCEIRO',
            message: 'Preciso de um dos dados para enviar!',
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

        const sendEmail = await getOrdersByDay(safeData.date)
        // console.log("Pedidos para enviar email financeiro", sendEmail)
        const ids_treasuries = []
        const ids_treasuries_origin = []
        interface Treasury {
            id_system: number;
            name: string;
            gmcore_number: string;
            id_type_store: number;
            account_number: string;
            region: number;
            account_number_for_transfer: string;
        }
        for (let x = 0; (sendEmail || []).length > x; x++) {
            ids_treasuries.push(sendEmail[x].id_treasury_destin)
            ids_treasuries_origin.push(sendEmail[x].id_treasury_origin)
        }

        const treasuries = await getForIds(ids_treasuries)
        const treasuries_origin = await getForIds(ids_treasuries_origin)
        const treasuryMap = (treasuries || []).reduce((map, treasury) => {
            map[treasury.id_system] = treasury;
            return map;
        }, {} as Record<number, Treasury>)
        const treasuryMapOrigin = (treasuries_origin || []).reduce((map, treasury) => {
            map[treasury.id_system] = treasury;
            return map;
        }, {} as Record<number, Treasury>)
        const mergedData = sendEmail?.map((order: any) => {
            const treasury = treasuryMap[order.id_treasury_destin] // Busca a tesouraria correspondente
            const treasury_origin = treasuryMapOrigin[order.id_treasury_origin] // Busca a tesouraria correspondente
            return {
                id_order: order.id,
                id_type_operation: order.id_type_operation,
                codigo: order.id_treasury_origin,
                conta: treasury?.account_number,
                tesouraria: treasury?.name,
                gmcore: treasury?.gmcore_number,
                regiao: treasury?.region,
                valor: returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
                id_type_store: treasury?.id_type_store,
                date: order.date_order,
                conta_pagamento: treasury?.account_number_for_transfer,
                valorRealizado: returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D),
                estorno: calcularEstornoBRL(
                    returnValueTotal(order.requested_value_A, order.requested_value_B, order.requested_value_C, order.requested_value_D),
                    returnValueTotal(order.confirmed_value_A, order.confirmed_value_B, order.confirmed_value_C, order.confirmed_value_D)
                ),
                codigo_destin: order.id_treasury_destin,
                tesouraria_origem: treasury_origin?.name,
            };
        });
        // console.log("Merged Data", mergedData)
        const dadosMateus = (mergedData || []).filter(
            (item) =>
                item.id_type_store === 1 &&
                (item.id_type_operation === 1 || item.id_type_operation === 2)
        )

        const dadosPosterus = (mergedData || []).filter(
            (item) => item.id_type_store === 2
        )
        // console.log("Dados Mateus", dadosMateus)
        // console.log("Dados Posterus", dadosPosterus)
        const banks = await getAllBank()
        if (!banks || banks.length === 0) {
            res.status(400).json({ error: "Nenhum banco encontrado para gerar os arquivos" })
            return
        }
        // console.log("Bancos", banks)
        const arquivosMateus = GenerateArrays(banks as bankType[], dadosMateus)
        const arquivosPosterus = GenerateArrays(banks as bankType[], dadosPosterus)
        // console.log("Arquivos Mateus", arquivosMateus)
        // console.log("Arquivos Posterus", arquivosPosterus)

        const arquivosMateusValidos = arquivosMateus.filter(
            (item) => item.type === "mateus" && item.data.length > 0
        )
        const arquivosPosterusValidos = arquivosPosterus.filter(
            (item) => item.type === "posterus" && item.data.length > 0
        )


        if (safeData.for_send_slug.toLowerCase() === "mateus") {
            const anexosMateus = await Promise.all(
                arquivosMateusValidos.map(async (grupo) => ({
                    filename: gerarNomeArquivo("mateus", grupo.data),
                    content: await gerarPdfBuffer("mateus", grupo.data),
                    contentType: "application/pdf",
                }))
            )
        }

        if (safeData.for_send_slug.toLowerCase() === "posterus") {
            const anexosPosterus = await Promise.all(
                arquivosPosterusValidos.map(async (grupo) => ({
                    filename: gerarNomeArquivo("posterus", grupo.data),
                    content: await gerarPdfBuffer("posterus", grupo.data),
                    contentType: "application/pdf",
                }))
            )
        }

        const emailsResponse = await getAllEmailsControlForSlugTypeStore(safeData.for_send_slug)

        if (!sendEmail) {
            await createLog({
                level: 'ERROR',
                action: 'SEND_EMAIL_FINANCEIRO',
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
            action: 'SEND_EMAIL_FINANCEIRO',
            message: 'Sucesso ao salvar!',
            userSlug: req.userSlug ?? null,
            route: req.route?.path ?? null,
            method: req.method ?? null,
            statusCode: 201,
            resource: 'emailParametrization',
            meta: { ids: safeData }
        })
        res.status(201).json({
            anexosMateus,
            anexosPosterus,
        })
        return
    } catch (error) {
        await createLog({
            level: 'ERROR',
            action: 'SEND_EMAIL_FINANCEIRO',
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