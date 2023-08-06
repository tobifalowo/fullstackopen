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

afterAll(async () => {
  await mongoose.connection.close()
})