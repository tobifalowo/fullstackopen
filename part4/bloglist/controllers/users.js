const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  const saltRounds = 10
  const passwordHash = await(bcrypt.hash(password, saltRounds))

  const user = new User({username, passwordHash, name})

  if (user.username === undefined || user.passwordHash === undefined || password === undefined) {
    response.status(400).json({ error: 'invalid user object' })
  } else {
    const result = await user.save()
    response.status(201).json(result)
  }
})

module.exports = usersRouter