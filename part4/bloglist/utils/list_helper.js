var lodash = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce(
    (a, c) => a + c.likes,
    0
  )
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else {
    const favorite = blogs.reduce(
      (a, c) => {
        if (a.likes > c.likes) {
          return a
        } else {
          return c
        }
      }
    )
    return favorite
  }
}

// returns the author who has the largest amount of blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else {
    const grouped = Object.values(lodash.groupBy(blogs, blog => blog.author))
    const top = grouped.reduce(
      (a, c) => {
        if (a.length > c.length) {
          return a
        } else {
          return c
        }
      }
    )
    return {
      author: top[0].author,
      blogs: top.length
    }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}