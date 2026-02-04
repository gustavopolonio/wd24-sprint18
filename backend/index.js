import express from 'express'
import mongoose from 'mongoose'
import { usersRouter } from './routes/users.js'
import { cardsRouter } from './routes/cards.js'
import { requestLogger, errorLogger } from './middlewares/reqLoggerMiddleware.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import 'dotenv/config'
import cors from 'cors'
import { AppError } from './errors/AppError.js'
import { authsRouter } from './routes/auths.js'
import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'

const { PORT = 3001 } = process.env

const app = express()

main()
  .then(() => console.log('Connected to Mongo'))
  .catch((err) => console.log(`Error connecting to mongo: ${err}`))

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mydb');
}

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// global
app.use(requestLogger)

app.use('/auth', authsRouter)

app.use(authMiddleware)
app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

// Middleare de erro do celebrate
app.use(errors())

app.use(errorLogger)

// Middleware executado qnd tentei acessar uma rota que nao foi definida acima
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' })
})

// Middleware para tratar erro 500 global
app.use((err, req, res, next) => {
  console.log(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: 'Dados inválidos' })
  }

  res.status(500).json({ message: 'Internal Error' })
})

app.listen(PORT, () => {
  console.log(`Server initialized on port ${PORT}!`)
})