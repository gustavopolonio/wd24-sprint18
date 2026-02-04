import { Card } from "../models/cards.js";

export async function getCards(req, res, next) {
  console.log(req.user._id)

  try {
    const cards = await Card.find({}).populate('author')

    res.status(200).json(cards)
  } catch (err) {
    next(err)
  }
}

export async function createCard(req, res, next) {
  const body = req.body

  try {
    const cardCreated = await Card.create({
      title: body.title,
      imageUrl: body.imageUrl,
      author: body.authorId
    })

    console.log(cardCreated);
  } catch (err) {
    next(err)
  }
  
  res.status(201).json({ message: 'Card created.' })
}