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
import { createLog } from "services/logService";
import { diffObjects, sanitizeContact, sanitizeContactPayload } from "utils/audit/audit-contact";

export const getAll: RequestHandler = async (req, res) => {
  try {
    const contact = await getAllContact()
    if (!contact) {
      await createLog({
        level: "ERROR",
        action: "GET_ALL_CONTACT",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_ALL_CONTACT",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      meta: { count: Array.isArray(contact) ? contact.length : 0 },
    })
    res.status(201).json({ contact });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_ALL_CONTACT",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return;
  }
};

export const getById: RequestHandler = async (req, res) => {
  const contactId = req.params.id;
  if (!contactId || isNaN(parseInt(contactId))) {
    await createLog({
      level: "ERROR",
      action: "GET_CONTACT_BY_ID",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  try {
    const contact = await getContactForId(contactId);
    if (!contact) {
      await createLog({
        level: "ERROR",
        action: "GET_CONTACT_BY_ID",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
        resourceId: String(contactId),
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_CONTACT_BY_ID",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      resourceId: String(contactId),
      meta: { contact: sanitizeContact(contact) },
    })
    res.status(201).json({ contact });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_CONTACT_BY_ID",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      resourceId: String(contactId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return;
  }
};

export const add: RequestHandler = async (req, res) => {
  const safeData = contactAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "ADD_CONTACT",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const data = {
      treasury: {
        connect: { id_system: safeData.data.id_treasury },
      },
      name: safeData.data.name,
      email: safeData.data.email,
      phone: safeData.data.phone ?? '',
    }

    const newContact = await addContact(data);
    if (!newContact) {
      await createLog({
        level: "ERROR",
        action: "ADD_CONTACT",
        message: "Erro ao salvar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
        meta: { payload: sanitizeContactPayload(safeData.data) },
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "ADD_CONTACT",
      message: "Sucesso ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      resourceId: String(newContact.id),
      meta: {
        created: sanitizeContact(newContact),
        payload: sanitizeContactPayload(safeData.data),
      },
    })
    res.status(201).json({ contact: newContact });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "ADD_CONTACT",
      message: "Erro ao salvar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: {
        payload: sanitizeContactPayload(safeData.success ? safeData.data : undefined),
        error: String(error),
      },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return;
  }
};

export const getByIdTreasury: RequestHandler = async (req, res) => {
  const treasuryId = req.params.id;
  if (!treasuryId || isNaN(parseInt(treasuryId))) {
    await createLog({
      level: "ERROR",
      action: "GET_CONTACT_BY_ID_TREASURY",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { error: "Requisição sem ID!" },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  try {
    const contact = await getForIdTreasury(parseInt(treasuryId));
    if (!contact) {
      await createLog({
        level: "ERROR",
        action: "GET_CONTACT_BY_ID_TREASURY",
        message: "Erro ao retornar dados!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
        meta: { idTreasury: treasuryId, error: "Erro ao retornar dados!" },
      })
      res.status(400).json({ error: "Erro ao salvar!" });
      return;
    }
    await createLog({
      level: "INFO",
      action: "GET_CONTACT_BY_ID_TREASURY",
      message: "Sucesso ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      meta: { payload: contact, idTreasury: treasuryId },
    })
    res.status(201).json({ contact });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "GET_CONTACT_BY_ID_TREASURY",
      message: "Erro ao retornar dados!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { error: "Erro ao retornar dados!" },
    })
    res.status(400).json({ error: "Erro ao salvar!" });
    return;
  }
};

export const update: RequestHandler = async (req, res) => {
  const contactId = req.params.id;
  if (!contactId || isNaN(parseInt(contactId))) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CONTACT",
      message: "Requisição sem ID!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { id: req.params.id },
    })
    res.status(400).json({ error: "Requisição sem ID!" });
    return;
  }
  const safeData = contactAddSchema.safeParse(req.body);
  if (!safeData.success) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CONTACT",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: { validation: safeData.error.flatten().fieldErrors },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }
  try {
    const before = await getContactForId(contactId);
    const updateCOntact = await updateContact(parseInt(contactId), safeData.data);
    if (!updateCOntact) {
      await createLog({
        level: "ERROR",
        action: "UPDATE_CONTACT",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
        resourceId: String(contactId),
        meta: { payload: sanitizeContactPayload(safeData.data), before: sanitizeContact(before) },
      })
      res.status(400).json({ error: "Erro ao Editar!" });
      return;
    }
    const metaBefore = await sanitizeContact(before);
    const metaAfter = sanitizeContact(updateCOntact);
    await createLog({
      level: "INFO",
      action: "UPDATE_CONTACT",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      resourceId: String(contactId),
      meta: {
        before: metaBefore,
        after: sanitizeContact(before),
        changed: diffObjects(metaBefore || {}, metaAfter || {}),
      },
    })
    res.status(201).json({ contact: updateCOntact });
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "UPDATE_CONTACT",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      meta: {
        payload: sanitizeContact(safeData.data),
        error: String(error)
      },
    })
    res.status(400).json({ error: "Erro ao Editar!" });
    return
  }
};

export const del: RequestHandler = async (req, res) => {
  const contactId = req.params.id
  if (!contactId || isNaN(parseInt(contactId))) {
    await createLog({
      level: "ERROR",
      action: "DELETE_CONTACT",
      message: "Informar ID para continuar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      resourceId: String(contactId),
    })
    res.status(400).json({ error: 'Informar ID para continuar!' })
    return
  }
  try {
    const before = await getContactForId(contactId)
    const contactA = await delContact(parseInt(contactId))
    if (!contactA) {
      await createLog({
        level: "ERROR",
        action: "DELETE_CONTACT",
        message: "Erro ao Editar!",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 400,
        resource: "contact",
        resourceId: String(contactId),
        meta: { before: sanitizeContact(before) },
      })
      res.status(400).json({ error: 'Erro ao Editar!' })
      return
    }
    const metaBefore = await sanitizeContact(before)
    const metaAfter = sanitizeContact(contactA)
    await createLog({
      level: "INFO",
      action: "DELETE_CONTACT",
      message: "Sucesso ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: "contact",
      resourceId: String(contactId),
      meta: {
        before: metaBefore,
        after: metaAfter,
        changed: diffObjects(metaBefore || {}, metaAfter || {})
      }
    })
    res.status(201).json({ account: contactA })
    return
  } catch (error) {
    await createLog({
      level: "ERROR",
      action: "DELETE_CONTACT",
      message: "Erro ao Editar!",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "contact",
      resourceId: String(contactId),
      meta: { error: String(error) },
    })
    res.status(400).json({ error: 'Erro ao Editar!' })
    return
  }
}
