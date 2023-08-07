const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 3,
  },
  {
    title: 'Go To Statement Considered Harmful 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful 3',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 13,
  }
]

const initialUsers = [
  {
    username: "test",
    password: "t4s90ig3",
    name: "Martin Tester"
  },
  {
    username: "rest",
    password: "t4sjfgh3",
    name: "Mathias Tester"
  },
  {
    username: "jest",
    password: "t7s5867ur",
    name: "Mary Tester"
  },
]

const getPasswordHash = async password => {
  const saltRounds = 10
  return await(bcrypt.hash(password, saltRounds))
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUsers, getPasswordHash
}