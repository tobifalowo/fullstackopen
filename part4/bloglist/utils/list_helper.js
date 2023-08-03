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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}