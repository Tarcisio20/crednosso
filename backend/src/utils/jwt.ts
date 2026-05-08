import { NextFunction, Request, Response, RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { findUserBySlug } from "../services/user"
import { ExtendedRequest } from "../types/extended-request"

export function createJWT(slug: string) {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign(
    { slug },
    secret,
    {
      expiresIn: '2d',
    }
  );
}

// export function createJWT(slug: string) {
//   const secret = process.env.JWT_SECRET as string;
//   return jwt.sign(
//     { /* payload adicional, se quiser */ },
//     secret,
//     {
//       subject: slug,           // sub = slug
//       expiresIn: '2d',         // ajuste como quiser
//       // issuer: 'sua-api',    // opcional
//       // audience: 'seu-front' // opcional
//     }
//   );
// }

// export const verifyJWT =  (req : ExtendedRequest, res : Response, next : NextFunction) => {
//     const authHeader = req.headers['authorization']
//     if(!authHeader){
//         res.status(401).json({ error : 'Acesso negado!' })
//         return
//     }
//     const token = authHeader.split(' ')[1]
//     jwt.verify(
//         token,
//         process.env.JWT_SECRET  as string,
//         async (error, decoded : any) =>  {
//             if(error){
//                 res.status(401).json({ error : 'Acesso negado!' })
//                 return 
//             }
//             const user = await findUserBySlug(decoded.slug)
//             if(!user){
//                 res.status(401).json({ error : 'Acesso negado!' })
//                 return   
//             }
//             req.userSlug = user.slug
//             next()
//     })  
// }

type JwtPayload = {
  sub?: string;          // usamos sub para o slug
  slug?: string;         // caso você ainda assine com { slug }
  iat?: number;
  exp?: number;
};

export const verifyJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    res.status(401).json({ error: 'Acesso negado!' });
    return;
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    res.status(401).json({ error: 'Token inválido!' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (error, decoded) => {
      if (error) {
        res.status(401).json({ error: 'Acesso negado!' });
        return;
      }

      try {
        const payload = decoded as JwtPayload;

        const slugUser = payload.sub ?? payload.slug;

        if (!slugUser) {
          res.status(401).json({ error: 'Token inválido!' });
          return;
        }

        const user = await findUserBySlug(slugUser);

        if (!user) {
          res.status(401).json({ error: 'Acesso negado!' });
          return;
        }

        req.idUser = user.id;
        req.userSlug = user.slug;
        req.nivelUser = user.nivel;

        next();
      } catch (e) {
        res.status(500).json({ error: 'Erro interno de autenticação' });
        return;
      }
    }
  );
};
// export const verifyJWT: RequestHandler = (req, res, next) => {
//   const authHeader = req.header('authorization');
//   if (!authHeader) {
//     res.status(401).json({ error: 'Acesso negado!' });
//     return;
//   }

//   const token = authHeader.split(' ')[1] ?? '';

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET as string,
//     async (error, decoded: any) => {
//       if (error) {
//         res.status(401).json({ error: 'Acesso negado!' });
//         return;
//       }

//       try {
//         const user = await findUserBySlug(decoded.slug);
//         if (!user) {
//           res.status(401).json({ error: 'Acesso negado!' });
//           return;
//         }

//         // graças à augmentation, agora isso é válido:
//         req.userSlug = user.slug;

//         next();
//       } catch (e) {
//         res.status(500).json({ error: 'Erro interno de autenticação' });
//         return;
//       }
//     }
//   );
// };