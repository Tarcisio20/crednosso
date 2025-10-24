import { RequestHandler } from "express"
import { changePasswordFromId, createUser, findUserByEmail, findUserBySlug, getAllUserPagination, getForId, updateUser } from "../services/user";
import { AddUserSchema } from "../schemas/userAddSchema";
import slug from "slug";
import { hash } from "bcrypt-ts";
import { generateHash } from "../utils/generateHash";
import { sendEmailOdCreateUser } from "../services/email";
import { changePasswordSchema } from "../schemas/changePasswordSchema";
import { createLog } from "services/logService";

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;
  try {
    const users = await getAllUserPagination(page, pageSize)
    if (!users) {
      await createLog({
        level: 'ERROR',
        action: 'GET_ALL_USER_PAGINATION',
        message: 'Erro ao carregar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'user',
        meta: { error: 'Erro ao carregar!' }
      })
      res.status(401).json({ error: 'Erro ao carregar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_USER_PAGINATION',
      message: 'Sucesso ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'user',
      meta: { message: 'Sucesso ao carregar!' }
    })
    res.status(200).json({ users })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_USER_PAGINATION',
      message: 'Erro ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Erro ao carregar!' }
    })
  }
}

export const getById: RequestHandler = async (req, res) => {
  const userId = req.params.id
  if (!userId || isNaN(parseInt(userId))) {
    await createLog({
      level: 'ERROR',
      action: 'GET_USER_BY_ID',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Requisição sem ID!' }
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  try {
    const user = await getForId(parseInt(userId))
    if (!user) {
      await createLog({
        level: 'ERROR',
        action: 'GET_USER_BY_ID',
        message: 'Erro ao carregar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'user',
        meta: { error: 'Erro ao carregar!' }
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'GET_USER_BY_ID',
      message: 'Sucesso ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'user',
      meta: { message: 'Sucesso ao carregar!' }
    })
    res.status(200).json({ user })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_USER_BY_ID',
      message: 'Erro ao carregar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Erro ao carregar!' }
    })
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }

}

export const add: RequestHandler = async (req, res) => {
  const safeData = AddUserSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_USER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { error: safeData.error.flatten().fieldErrors }
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const emailExists = await findUserByEmail(safeData.data.email)
  if (emailExists) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_USER',
      message: 'Email já cadastrado!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Email já cadastrado!' }
    })
    res.status(401).json({ error: 'Email já cadastrado!' })
    return
  }

  let genSlug = true
  let userSlug = slug(safeData.data.name)
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug)
    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString()
      userSlug = slug(safeData.data.name + slugSuffix)
    } else {
      genSlug = false
    }
  }

  const genHash = generateHash(6)

  const hasPassword = await hash(genHash, 10)

  try {
    const newUser = await createUser({
      name: safeData.data.name,
      slug: userSlug,
      email: safeData.data.email,
      password: hasPassword
    })


    const sendEmail = await sendEmailOdCreateUser(safeData.data.name, safeData.data.email, genHash)

    if (!newUser) {
      await createLog({
        level: 'ERROR',
        action: 'ADD_USER',
        message: 'Erro ao salvar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'user',
        meta: { error: 'Erro ao salvar!' }
      })
      res.status(401).json({ error: 'Erro ao salvar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'ADD_USER',
      message: 'Sucesso ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'user',
      meta: { message: 'Sucesso ao salvar!' }
    })
    res.status(200).json({ user: newUser })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'ADD_USER',
      message: 'Erro ao salvar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Erro ao salvar!' }
    })
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }
}

export const update: RequestHandler = async (req, res) => {
  const userId = req.params.id
  if (!userId || isNaN(parseInt(userId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Requisição sem ID!' },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  const safeData = AddUserSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { error: safeData.error.flatten().fieldErrors }
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const updateU = await updateUser(parseInt(userId), safeData.data)
    if (!updateU) {
      await createLog({
        level: 'ERROR',
        action: 'UPDATE_USER',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'user',
        meta: { error: 'Erro ao Editar!' }
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'UPDATE_USER',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'user',
      meta: { message: 'Sucesso ao Editar!' }
    })
    res.status(200).json({ user: updateU })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Erro ao Editar!' }
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }
}

export const changePassword: RequestHandler = async (req, res) => {
  const userId = req.params.id
  if (!userId || isNaN(parseInt(userId))) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Requisição sem ID!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Requisição sem ID!' },
    })
    res.status(401).json({ error: 'Requisição sem ID!' })
    return
  }
  const safeData = changePasswordSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { error: safeData.error.flatten().fieldErrors }
    })
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  try {
    const change = await changePasswordFromId(parseInt(userId), safeData.data)
    if (!change) {
      await createLog({
        level: 'ERROR',
        action: 'UPDATE_USER',
        message: 'Erro ao Editar!',
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 401,
        resource: 'user',
        meta: { error: 'Erro ao Editar!' }
      })
      res.status(401).json({ error: 'Erro ao Editar!' })
      return
    }
    await createLog({
      level: 'INFO',
      action: 'UPDATE_USER',
      message: 'Sucesso ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: 'user',
      meta: { message: 'Sucesso ao Editar!' }
    })
    res.status(200).json({ user: change })
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'UPDATE_USER',
      message: 'Erro ao Editar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 401,
      resource: 'user',
      meta: { error: 'Erro ao Editar!' }
    })
    res.status(401).json({ error: 'Erro ao Editar!' })
    return
  }
}
