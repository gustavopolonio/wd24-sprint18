import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import { authenticate, logout, refreshToken, register } from '../controllers/auth.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

export const authsRouter = Router()

authsRouter.post(
  '/register',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().min(6).required(),
      password: Joi.string().min(6).required()
    })
  }),
  register
)

authsRouter.post('/login', authenticate)

authsRouter.post('/refresh', refreshToken)

authsRouter.post('/logout', authMiddleware, logout)

// Observabilidade - logs
