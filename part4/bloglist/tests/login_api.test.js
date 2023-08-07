const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

test('able to register and login', async () => {
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

  const response1 = await api.get('/api/users')

  expect(response1.body).toHaveLength(1)
  const gotUser = response1.body[0]
  expect(gotUser.username).toEqual(newUser.username)

  const loginInfo = {
    username: newUser.username,
    password: newUser.password,
  }
  
  const response2 = await api
    .post('/api/login')
    .send(loginInfo)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response2.body.token).toBeTruthy()
  expect(response2.body.username).toEqual(newUser.username)
  expect(response2.body.name).toEqual(newUser.name)
})

afterAll(async () => {
  await mongoose.connection.close()
})