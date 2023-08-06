const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  helper.initialUsers.forEach(async (user) => {
    let userObject = new User(user)
    await userObject.save()
  })
})

test('correct amount of users are returned as json', async () => {
  const response = await api.get('/api/users')

  expect(response.body).toHaveLength(helper.initialUsers.length)
})

test('the unique identifier property of the user is named id', async () => {
  const response = await api.get('/api/users')

  const exampleUser = response.body[0]
  expect(exampleUser.id).toBeDefined()
})

test('a valid user post can be added', async () => {
  const newUser = {
    username: "jester",
    password: "trobadour",
    name: "Molly Jester"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')

  const usernames = response.body.map(r => r.username)

  expect(response.body).toHaveLength(helper.initialUsers.length + 1)
  expect(usernames).toContain(
    'jester'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})