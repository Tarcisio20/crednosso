import { RequestHandler } from "express";
import { getOrderById } from "../services/order";
import { getForIdTreasury } from "../services/contact";
import { sendEmailOfOrder } from "../services/email";
import { getForIdSystem } from "../services/treasury";

export const sendEmailToOrder : RequestHandler = async (req, res) => {
    const idsOrder = req.body
    if(idsOrder.length === 0){
        res.json({ error: "Erro ao processar!"})
        return
    }
    const emails = []
    const orders = []
    for(let x = 0; idsOrder.length > x; x++){
        let order : any = await getOrderById(parseInt(idsOrder[x]))
        let treasury : any = await getForIdSystem(order[0].id_treasury_destin)
        console.log("order",order)
        orders.push({
            id : order[0].id,
            id_type_operation : order[0].id_type_operation,
            id_trasury : order[0].id_treasury_destin,
            name_treasury : treasury.name_for_email,
            date : order[0].date_order,
            value_10 : order[0].requested_value_A,
            value_20 : order[0].requested_value_B,
            value_50 : order[0].requested_value_C,
            value_100 : order[0].requested_value_D,
        })
        let ctc : any = await getForIdTreasury(order[0].id_treasury_destin)
        console.log("Contato", ctc)
        for(let i = 0; ctc?.length > i; i++){
           emails.push(ctc[i].email)
        }
       //return
    }
    //const e : any = await sendEmailOfOrder(emails.join(',') as string, orders)
    const e = true
    if(e === true){
        res.json({ email: true })
    }else{
        res.status(401).json({ error: 'Erro no envio!' })
    }
}   