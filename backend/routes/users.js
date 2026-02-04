import { Router } from 'express'
import { User } from '../models/users.js'
import { getAuthenticatedUser, getUserByUsername } from '../controllers/users.js'
import { NotFoundError } from '../errors/NotFoundError.js'

export const usersRouter = Router()

usersRouter.get('/me', getAuthenticatedUser)

// Query params
usersRouter.get('/', getUserByUsername)

usersRouter.put('/', async (req, res, next) => {
  const body = req.body
  const userId = req.user._id

  try {
    const userUpdated = await User
      .findByIdAndUpdate(userId, body)
      .orFail(() => { throw new NotFoundError('User not found') })

    console.log(userUpdated);
  } catch (err) {
    next(err)
  }

  res.status(200).json({ message: 'User updated!' })
})

// Rota dinamica (route params)
usersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  console.log('Deletar user com id: ', id);

  // Checar se o user com id existe
  // if (!id) {
  //   return res.status(404).json({ message: 'User not found' })
  // }

  // Deletaria o user do DB
  try {
    await User
      .findByIdAndDelete(id)
      .orFail(() => { throw new NotFoundError('User not found') })
  } catch (err) {
    next(err)
  }

  res.status(204).send()
})