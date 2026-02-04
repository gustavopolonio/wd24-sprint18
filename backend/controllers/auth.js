import { compare, genSalt, hash } from "bcryptjs"
import jwt from 'jsonwebtoken'
import { User } from "../models/users.js"
import { UnauthorizedError } from "../errors/UnauthorizedError.js"

export async function register(req, res, next) {
  const body = req.body

  try {
    const salt = await genSalt(10)
    const passwordHash = await hash(body.password, salt)

    const userCreated = await User.create({
      email: body.email,
      password: passwordHash
    })
  } catch (err) {
    next(err)
  }
  
  res.status(201).json({ message: 'User created.' })
}

export async function authenticate(req, res, next) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos')
    }
    
    const isPasswordCorrect = await compare(password, user.password)

    if (!isPasswordCorrect) {
      throw new UnauthorizedError('E-mail ou senha inválidos')
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 30 } // 5 min
    )

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: 7 * 24 * 60 * 60 } // 1 semana
    )

    user.refreshToken = refreshToken
    await user.save() // Recomendado -> salvar o hash do refresh

    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
      }
    )

    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
}

export async function refreshToken(req, res, next) {
  try {
    // Pegar o refresh token dos cookies e validar ele
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      throw new UnauthorizedError()
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
    // Procurar o user pelo id
    const user = await User.findById(payload._id).select('+refreshToken')

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError()
    }

    // Gerar um novo access token e retornar
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: 5 * 60 } // 5 min
    )

    const newRefreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: 7 * 24 * 60 * 60 } // 1 semana
    )

    user.refreshToken = newRefreshToken
    await user.save() // Recomendado -> salvar o hash do refresh

    res.cookie(
      'refreshToken',
      newRefreshToken,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60
      }
    )

    res.status(200).json({ token })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  const userId = req.user._id
  
  try {
    // Refresh do DB -> null
    await User.findByIdAndUpdate(userId, { refreshToken: null })

    // Deletar o cookie refrehStoken
    res.clearCookie(
      'refreshToken',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      }
    )

    res.status(204).send()
  } catch (err) {
    next(err)
  }
  
}