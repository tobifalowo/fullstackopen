const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user)
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json({ error: 'invalid blog object' })
    return
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const retBlog = await blog.populate('user')
  response.status(201).json(retBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if (blog.user.toString() !== request.user.toString()) {
    return response.status(401).json({ error: 'access denied' })
  }

  await Blog.findByIdAndRemove(blogId)
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