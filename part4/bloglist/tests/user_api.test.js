const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = helper.initialUsers
    .map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
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

test('a valid user profile can be added', async () => {
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

test('reject invalid user posts', async () => {
  const newUser0 = {
    username: "jester",
    password: "trobadour",
    name: "Molly Jester"
  }
  let newUser1 = {...newUser0}
  newUser1.username = "12"
  let newUser2 = {...newUser0}
  newUser2.password = "12"
  let newUser3 = {...newUser0}
  newUser3.username = undefined
  let newUser4 = {...newUser0}
  newUser4.password = undefined
  
  await api
    .post('/api/users')
    .send(newUser1)
    .expect(400)
  
  await api
    .post('/api/users')
    .send(newUser2)
    .expect(400)

  await api
    .post('/api/users')
    .send(newUser3)
    .expect(400)
    
  await api
    .post('/api/users')
    .send(newUser4)
    .expect(400)

})

test('reject duplicate user posts', async () => {
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

  const firstResponse = await api.get('/api/users')
  
  expect(firstResponse.body).toHaveLength(helper.initialUsers.length + 1)

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('expected `username` to be unique')

  const secondResponse = await api.get('/api/users')
  
  expect(secondResponse.body).toHaveLength(helper.initialUsers.length + 1)

})

afterAll(async () => {
  await mongoose.connection.close()
})