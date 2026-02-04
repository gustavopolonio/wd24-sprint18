import { Router } from 'express'
import { createCard, getCards } from '../controllers/cards.js'

export const cardsRouter = Router()

cardsRouter.get('/', getCards)
cardsRouter.post('/', createCard)