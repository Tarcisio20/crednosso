import { RequestHandler } from "express";
import { contactAddSchema } from "../schemas/contactAddSchema";
import {
  getAllContact,
  addContact,
  getContactForId,
  getForIdTreasury,
  updateContact,
  delContact,
} from "../services/contact";

export const getAll: RequestHandler = async (req, res) => {
  const contact = await getAllContact()
  if (!contact) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ contact });
};

export const getById: RequestHandler = async (req, res) => {
  const contactId = req.params.id;
  const contact = await getContactForId(contactId);
  if (!contact) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ contact });
};

export const add: RequestHandler = async (req, res) => {
  const safeData = contactAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const data = {
     treasury: {
      connect: { id_system   : safeData.data.id_treasury },
    },
    name: safeData.data.name,
    email: safeData.data.email,
    phone: safeData.data.phone ?? '',
  }

   const newContact = await addContact(data);
  if (!newContact) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ contact: newContact });
};

export const getByIdTreasury: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id;
  if (!treasuryId) {
    res.status(401).json({ error: "Requisição sem ID!" });
    return;
  }
  const contact = await getForIdTreasury(parseInt(treasuryId));
  if (!contact) {
    res.status(401).json({ error: "Erro ao salvar!" });
    return;
  }

  res.json({ contact });
};

export const update: RequestHandler = async (req, res) => {
  const contactId = req.params.id;
  const safeData = contactAddSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  const updateCOntact = await updateContact(parseInt(contactId), safeData.data);
  if (!updateCOntact) {
    res.status(401).json({ error: "Erro ao Editar!" });
    return;
  }

  res.json({ contact: updateCOntact });
};

export const del: RequestHandler = async (req, res) => {
    const contactId = req.params.id

    if(!contactId){
        res.status(401).json({ error: 'Informar ID para continuar!' })
        return
    }
    const contactA = await delContact(parseInt(contactId))
    if(!contactA){  
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }
    

    res.json({ account: contactA })

}
