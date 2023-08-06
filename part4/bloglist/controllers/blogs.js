const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json({ error: 'invalid blog object' })
  } else {
    const result = await blog.save()
    response.status(201).json(result)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog ={
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json({ error: 'invalid blog object' })
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
  }
})

module.exports = blogsRouter