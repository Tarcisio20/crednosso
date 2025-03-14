import { RequestHandler } from "express";
import { getOrderById } from "../services/order";
import { getForIdTreasury } from "../services/contact";
import { sendEmailOfOrder } from "../services/email";

export const sendEmailToOrder : RequestHandler = async (req, res) => {
    const idsOrder = req.body
    if(idsOrder.length === 0){
        res.json({ error: "Erro ao processar!"})
        return
    }
    const emails = []
    for(let x = 0; idsOrder.length > x; x++){
        let order : any = await getOrderById(parseInt(idsOrder[x]))
        let ctc : any = await getForIdTreasury(order[0].id_treasury_origin)
        for(let i = 0; ctc?.length > i; i++){
           emails.push(ctc[i].email)
        }
        const e = await sendEmailOfOrder(emails.join(';') as string)
        console.log(e)
       //return
    }
}   