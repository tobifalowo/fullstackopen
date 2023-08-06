const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  helper.initialBlogs.forEach(async (blog) => {
    let blogObject = new Blog(blog)
    await blogObject.save()
  })
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

afterAll(async () => {
  await mongoose.connection.close()
})