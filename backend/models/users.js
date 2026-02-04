import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  refreshToken: {
    type: String,
    select: false
  },
  username: {
    type: String,
    minlength: 2,
    maxlength: 30,
    // required: true
  },
  age: {
    type: Number,
    // required: true,
    validate: {
      validator(v) {
        return v >= 18
      },
      message: 'O user precisa ter mais do que 18 anos'
    }
  }
})

export const User = mongoose.model('user', userSchema)