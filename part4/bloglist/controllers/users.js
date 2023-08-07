const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (password === undefined) {
    response.status(400).json({ error: 'password is undefined' })
  } else {
    const saltRounds = 10
    const passwordHash = await(bcrypt.hash(password, saltRounds))
    const blogs = []

    const user = new User({username, passwordHash, name, blogs})

    if (user.username === undefined || user.passwordHash === undefined || password === undefined) {
      response.status(400).json({ error: 'invalid user object' })
    } else if (username.length < 3 || password.length < 3) {
      response.status(400).json({ error: 'username and password must be at least 3 characters' })
    } else {
      const result = await user.save()
      response.status(201).json(result)
    }
  }
})

module.exports = usersRouter