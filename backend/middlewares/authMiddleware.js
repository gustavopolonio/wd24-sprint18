import jwt from 'jsonwebtoken'
import { UnauthorizedError } from "../errors/UnauthorizedError.js"

export function authMiddleware(req, res, next) {
  // req.user._id
  // Verificação se user tá logado ou não
  const token = req.headers.authorization
  
  if (!token || !token.startsWith('Bearer ')) {
    throw new UnauthorizedError()
  }

  // Verificar se o token é valido - nao ta expirado e foi gerado pela nossa app
  const tokenJwt = token.replace('Bearer ', '')
  let payload

  try {
    // id do user
    payload = jwt.verify(tokenJwt, process.env.JWT_SECRET)
  } catch (error) {
    throw new UnauthorizedError()
  }

  req.user = {
    _id: payload._id
  }

  next()
}