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

// returns the author who has the largest amount of likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else {
    const grouped = Object.values(lodash.groupBy(blogs, blog => blog.author))
    const top = grouped
      .map(
        blogs => {
          return {
            author: blogs[0].author,
            likes: blogs.reduce(
              (a, blog) => a + blog.likes,
              0
            )
          }
        })
      .reduce(
        (a, c) => {
          if (a.likes > c.likes) {
            return a
          } else {
            return c
          }
        }
      )
    return top
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}