import { RequestHandler } from "express"
import { changePasswordFromId, createUser, findUserByEmail, findUserBySlug, getAllUserPagination, getForId, updateUser } from "../services/user";
import { AddUserSchema } from "../schemas/userAddSchema";
import slug from "slug";
import { hash } from "bcrypt-ts";
import { generateHash } from "../utils/generateHash";
import { sendEmailOdCreateUser } from "../services/email";
import { changePasswordSchema } from "../schemas/changePasswordSchema";

export const getAllPagination: RequestHandler = async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 15;
  const skip = (page - 1) * pageSize;

  const users = await getAllUserPagination(page, pageSize)
  if (!users) {
    res.status(401).json({ error: 'Erro ao carregar!' })
    return
  }
  res.json({ users })

}

export const getById: RequestHandler = async (req, res) => {
    const userId = req.params.id
    const user = await getForId(parseInt(userId))
    if (!user) {
        res.status(401).json({ error: 'Erro ao salvar!' })
        return
    }

    res.json({ user })
}

export const add: RequestHandler = async (req, res) => {
  const safeData = AddUserSchema.safeParse(req.body)
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors })
    return
  }

  const emailExists = await findUserByEmail(safeData.data.email)
  if (emailExists) {
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

  const newUser = await createUser({
    name: safeData.data.name,
    slug: userSlug,
    email: safeData.data.email,
    password: hasPassword
  })


  const sendEmail = await sendEmailOdCreateUser(safeData.data.name, safeData.data.email, genHash)

  if (!newUser) {
    res.status(401).json({ error: 'Erro ao salvar!' })
    return
  }

  res.json({ user: newUser })
}

export const update: RequestHandler = async (req, res) => {
    const userId = req.params.id
    const safeData = AddUserSchema.safeParse(req.body)
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const updateU = await updateUser(parseInt(userId), safeData.data)
    if (!updateU) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ user : updateU })

}

export const changePassword: RequestHandler = async (req, res) => {
    const userId = req.params.id
    const safeData = changePasswordSchema.safeParse(req.body)
    if(!userId){
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }
    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors })
        return
    }
    const change = await changePasswordFromId(parseInt(userId), safeData.data)
    if (!change) {
        res.status(401).json({ error: 'Erro ao Editar!' })
        return
    }

    res.json({ user : change })

}
