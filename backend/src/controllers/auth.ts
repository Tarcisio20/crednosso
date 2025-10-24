import { RequestHandler } from "express";
import { registerSchema } from "../schemas/register";
import { createUser, findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";
import { loginSchema } from "../schemas/login";
import { createLog } from "services/logService";
import { sanitizeUser, sanitizeUserLoginPayload, sanitizeUserRegisterPayload } from "utils/audit/audit-user";

export const register: RequestHandler = async (req, res) => {
  const safeData = registerSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'REGISTER_USER',
      message: 'Erro ao cadastrar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { validation: safeData.error.flatten().fieldErrors, payload: sanitizeUserRegisterPayload(req.body) },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const hasEmail = await findUserByEmail(safeData.data.email)
  if (hasEmail) {
    await createLog({
      level: 'ERROR',
      action: 'REGISTER_USER',
      message: 'Erro ao cadastrar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { payload: sanitizeUserRegisterPayload(safeData.data) },
    })
    res.status(400).json({ error: 'E-mail já existe' })
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
  try {
    const hasPassword = await hash(safeData.data.password, 10)
    const newUser = await createUser({
      name: safeData.data.name,
      slug: userSlug,
      email: safeData.data.email,
      password: hasPassword
    })
    await createLog({
      level: 'INFO',
      action: 'REGISTER_USER',
      message: 'Usuario cadastrado com sucesso',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 201,
      resource: 'user',
      resourceId: newUser?.slug ?? null,
      meta: {
        created: sanitizeUser(newUser),
        payload: sanitizeUserRegisterPayload(safeData.data),
      },
    })
    const token = createJWT(userSlug)
    res.status(201).json({
      token,
      user: {
        id: newUser?.id,
        name: newUser?.name,
        slug: newUser?.slug,
        email: newUser?.email
      }
    })
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'REGISTER_USER',
      message: 'Erro ao cadastrar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { payload: sanitizeUserRegisterPayload(safeData.success ? safeData.data : undefined), error: String((error as any)?.message ?? error) },
    })
    res.status(400).json({ error })
    return
  }
}

export const login: RequestHandler = async (req, res) => {
  const safeData = loginSchema.safeParse(req.body)
  if (!safeData.success) {
    await createLog({
      level: 'ERROR',
      action: 'LOGIN_USER',
      message: 'Erro ao logar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { validation: safeData.error.flatten().fieldErrors, payload: sanitizeUserLoginPayload(req.body) },
    })
    res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    return
  }
  const user = await findUserByEmail(safeData.data.email)
  if (!user) {
    await createLog({
      level: 'ERROR',
      action: 'LOGIN_USER',
      message: 'Erro ao logar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { payload: sanitizeUserLoginPayload(safeData.data) },
    })
    res.status(400).json({ error: 'Acesso negado!' })
    return
  }
  const verifyPass = await compare(safeData.data.password, user.password)
  if (!verifyPass) {
    await createLog({
      level: 'ERROR',
      action: 'LOGIN_USER',
      message: 'Erro ao logar usuario',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: 'user',
      meta: { payload: sanitizeUserLoginPayload(safeData.data) },
    })
    res.status(400).json({ error: 'Acesso negado!' })
    return
  }
  const token = createJWT(user.slug)
  await createLog({
    level: 'INFO',
    action: 'LOGIN_USER',
    message: 'Usuario logado com sucesso',
    userSlug: req.userSlug ?? null,
    route: req.route?.path ?? null,
    method: req.method ?? null,
    statusCode: 201,
    resource: 'user',
    resourceId: user.slug,
    meta: { user: sanitizeUser(user) },
  })
  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      slug: user.slug
    }
  })
}