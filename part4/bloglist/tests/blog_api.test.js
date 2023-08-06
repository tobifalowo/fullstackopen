const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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
    likes: 0,
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
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
    .send(newBlog1)
    .expect(400)
  
  await api
    .post('/api/blogs')
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
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let response = await api.get('/api/blogs')
  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog).toBeDefined()

  const id = foundBlog.id

  expect(id).toBeDefined()

  console.log('deleting: ', id)

  await api
    .delete(`/api/blogs/${id}`)
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
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  let response = await api.get('/api/blogs')
  const foundBlog = response.body.find(blog => blog.title === newBlog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(foundBlog).toBeDefined()

  const id = foundBlog.id

  expect(id).toBeDefined()

  console.log('replacing: ', id)

  await api
    .put(`/api/blogs/${id}`)
    .send(replacementBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  response = await api.get('/api/blogs')
  const replacedBlog = response.body.find(blog => blog.id === id)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(replacedBlog.title).toBe(replacementBlog.title)
})

afterAll(async () => {
  await mongoose.connection.close()
})