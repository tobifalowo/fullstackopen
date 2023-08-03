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

module.exports = {
  dummy,
  totalLikes
}