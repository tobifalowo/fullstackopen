const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let gToken = null

const performLogin = async (user) => {
  const selectedUser = user
  const loginInfo = {
    username: selectedUser.username,
    password: selectedUser.password,
  }

  const response = await api
    .post('/api/login')
    .send(loginInfo)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.token).toBeTruthy()
  expect(response.body.username).toEqual(selectedUser.username)
  expect(response.body.name).toEqual(selectedUser.name)

  return response.body.token
}

beforeAll(async () => {
  await User.deleteMany({})

  await Promise.all(helper.initialUsers.map(async user => {
    const userCopy = {...user}
    delete userCopy.password
    expect(user.password).toBeTruthy()
    userCopy.passwordHash = await helper.getPasswordHash(user.password)
    const reqUser = new User(userCopy)
    await reqUser.save()
  }))

  gToken = await performLogin(helper.initialUsers[0])
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const blogPromiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(blogPromiseArray)
})

test('correct amount of blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const exampleBlog = response.body[0]
  expect(exampleBlog.id).toBeDefined()
})

test('a valid blog post can be added', async () => {
  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 0
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response2 = await api.get('/api/blogs')

  const titles = response2.body.map(r => r.title)

  expect(response2.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain(
    'Donuts Explained'
  )
})

test('blog likes default to 0', async () => {
  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog.likes).toBe(0)
})

test('reject invalid blog posts', async () => {
  const newBlog1 = {
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
  }
  const newBlog2 = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog1)
    .expect(400)
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog2)
    .expect(400)
})

test('delete blog posts', async () => {
  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 0,
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let response = await api.get('/api/blogs')
  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog).toBeDefined()

  const id = foundBlog.id

  expect(id).toBeDefined()

  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${gToken}`)
    .expect(204)

  response = await api.get('/api/blogs')
  const deletedBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect(deletedBlog).toBeUndefined()
})

test('replace blog posts', async () => {
  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 0,
  }

  const replacementBlog = {
    title: 'Donuts Devoured',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts2',
    likes: 0,
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let response = await api.get('/api/blogs')
  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog).toBeDefined()

  const id = foundBlog.id

  expect(id).toBeDefined()

  await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${gToken}`)
    .send(replacementBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  response = await api.get('/api/blogs')
  const replacedBlog = response.body.find(blog => blog.id === id)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(replacedBlog.title).toBe(replacementBlog.title)
})

test('a new blog references a user', async () => {
  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
  }
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${gToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog.user).toBeTruthy()

  const userID = foundBlog.user.id
  expect(userID).toBeTruthy()
  const foundUser = await User.findById(userID)

  expect(foundUser).toBeTruthy()
  expect(foundUser.blogs).toBeDefined()
  expect(foundUser.blogs.includes(foundBlog.id)).toEqual(true)
})

test('reject blog posted with invalid token', async () => {
  const token = "abc"

  const newBlog = {
    title: 'Donuts Explained',
    author: 'Homer Simpson',
    url: 'http://www.blogger.xyz/homer/donuts',
    likes: 0,
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(401)
})


test('reject blog deletion with invalid token', async () => {
  const token = "abc"

  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  const id = blog.id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(401)

  await api
    .delete(`/api/blogs/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})